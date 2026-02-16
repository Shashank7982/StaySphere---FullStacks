

// EXTERNAL MODULES
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
// LOCAL MODULES
const User = require('../models/user');


exports.getSignup = (req, res, next) => {
    res.render('auth/signup',
        {
            pageTitle: 'signup page',
            currentPage: 'signup',
            isLoggedIn: false,
            oldInputs: [],
            errors: [],
            user: {}
        })
}

exports.postSignup = [
    // validators for each field
    check("firstName")
        .trim()
        .isLength({ min: 2 })
        .withMessage("First name must be atleast 2 characters long")
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage("First name can only contain letters"),

    check("lastName")
        .trim()
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage("First name can only contain letters"),

    check("email")
        .isEmail()
        .withMessage("Please enter valid email")
        .normalizeEmail(),

    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must contain atleast one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain atleast one uppercase letter")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain atleast one special character")
        .trim(),

    check("confirmPassword")
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error("Passwords donot match")
            }
            return true;
        }),

    check("userType")
        .notEmpty()
        .withMessage("User type is required")
        .isIn(['guest', 'host'])
        .withMessage("Invalid user type"),

    check("termsAccepted")
        .notEmpty()
        .withMessage("You must accept terms and conditions")
        .custom((value) => {
            if (value !== 'on')
                throw new Error("You must accept terms and conditions")
            return true;
        }),

    async (req, res, next) => {
        const { firstName, lastName, email, password, userType } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("error in validation", errors)
            return res.status(422).render('auth/signup', {
                pageTitle: 'signup page',
                currentPage: 'signup',
                isLoggedIn: false,
                oldInputs: { firstName, lastName, email, password, userType },
                errors: errors.array().map(err => ({
                    param: err.path,
                    msg: err.msg
                })),
                user: {},
            })
        } else {
            const hashPassword = await bcrypt.hash(password, 12);
            const user = new User({ firstName, lastName, email, password: hashPassword, userType });
            user.save()
                .then(() => {
                    res.redirect('/login');
                })
                .catch((err) => {
                    console.log("error in db saving")
                    res.status(422).render('auth/signup', {
                        pageTitle: 'signup page',
                        currentPage: 'signup',
                        isLoggedIn: false,
                        oldInputs: { firstName, lastName, email, password, userType },
                        errors: [{ param: "database", msg: err.message }],
                        user: {}
                    })
                })
        }
    }
]

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'login page',
        currentPage: 'login',
        isLoggedIn: false,
        errors: [],
        oldInputs: {},
        user: {}
    })
}

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.render('auth/login', {
                pageTitle: 'login page',
                currentPage: 'login',
                isLoggedIn: false,
                errors: ["Incorrect email or password"],
                oldInputs: { email },
                user: {}
            });
        }

        // Check if user has a password (should always be true for valid users)
        if (!user.password) {
            return res.render('auth/login', {
                pageTitle: 'login page',
                currentPage: 'login',
                isLoggedIn: false,
                errors: ["Account error. Please contact support."],
                oldInputs: { email },
                user: {}
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log('User logged in:', user.email);
            await req.session.save();
            return res.redirect('/store');
        }

        // Password doesn't match
        return res.render('auth/login', {
            pageTitle: 'login page',
            currentPage: 'login',
            isLoggedIn: false,
            errors: ["Incorrect email or password"],
            oldInputs: { email },
            user: {}
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.render('auth/login', {
            pageTitle: 'login page',
            currentPage: 'login',
            isLoggedIn: false,
            errors: ["An error occurred. Please try again."],
            oldInputs: { email },
            user: {}
        });
    }
}

exports.postLogOut = (req, res, next) => {

    req.session.destroy(() => {
        res.redirect('/auth/login');
    });

}