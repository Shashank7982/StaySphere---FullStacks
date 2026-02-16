// CORE MODULES
const path = require('path');

// EXTERNAL MODULES
const express = require('express');
const { default: mongoose } = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
require('dotenv').config();
const multer = require('multer')

// LOCAL MODULES
const connectDB = require('./config/database');
const { storeRouter } = require('./routes/storeRouter');
const { hostRouter } = require('./routes/hostRouter');
const authRouter = require('./routes/authRouter');
const rootDir = require('./utils/pathUtils');
const errorController = require('./controllers/errors');
const DB_PATH = process.env.MONGO_URL;

// creating session store(obj from imported class) in required db with collection name.
const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
});


// creating app
const app = express();

// setting ejs with express and specifying path to ejs templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const randomNameGenerator = (length) => {
    const characters = 'qwertyuioplkjhgfdsazxcvbnm';
    let randomName = '';
    for (i = 0; i < length; i++) {
        randomName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomName;
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname == 'photo') {
            cb(null, 'uploads/images/');
        }
        else {
            cb(null, 'uploads/pdfs/');
        }

    },
    filename: (req, file, cb) => {
        if (file.fieldname == 'photo') {
            cb(null, randomNameGenerator(10) + "-" + file.originalname);
        }
        else {
            cb(null, randomNameGenerator(10) + "-" + file.originalname);
        }
    }
})
// server side validation for filetype
const fileFilter = (req, file, cb) => {
    if (file.fieldname == 'photo') {
        if (['image/jpg', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(null, false);
        }
    }
    else {
        // for pdf file
        if (file.fieldname == 'rulesPdf' && file.mimetype === 'application/pdf') {
            cb(null, true);
        }
        // if not pdf file
        else {
            cb(null, false);
        }
    }
}

const multerOptions
    = { storage, fileFilter }
// parsing  url encoded request
app.use(express.urlencoded({ extended: true }));
// parsing multi form data
app.use(multer(multerOptions).fields([{ name: 'photo', maxCount: 1 }, { name: 'rulesPdf', maxCount: 1 }]));

// granting access to uploads folder
app.use('/uploads', express.static(path.join(rootDir, 'uploads')));
// granting access to public folder
app.use(express.static(path.join(rootDir, 'public')));

// creating session object 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store
}))

// middleware for accessing session
app.use((req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    req.user = req.session.user;
    next();
})

// using routers for seperate interfaces-host,user,authentication
app.use("/auth", authRouter);
app.use("/store", storeRouter);

// middleware for checking login status
app.use((req, res, next) => {
    if (req.isLoggedIn)
        next();
    else
        res.redirect('/auth/login');
})

app.use("/host", hostRouter);

// unknown routing handling
app.use(errorController.pageNotFound);

// starting server after connecting to db
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}/store`);
    });
});

