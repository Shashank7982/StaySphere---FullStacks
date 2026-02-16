// CORE MODULES
const mongoose = require('mongoose');
const path = require('path');
// LOCAL MODULES
const Home = require('../models/home');
const User = require('../models/user');
const favourites = require('../models/favourites');
const rootDir = require('../utils/pathUtils');



exports.getIndex = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/index', { registeredHomes: registeredHomes, pageTitle: 'StaySphere Home', currentPage: 'index', isLoggedIn: req.isLoggedIn, user: req.session.user });
    })

        ;

};

exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/homeList', { registeredHomes: registeredHomes, pageTitle: 'homes list', currentPage: 'home', isLoggedIn: req.isLoggedIn, user: req.session.user });
    });

};

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;

    Home.findById(homeId).then(home => {

        if (!home) {
            res.redirect('/store/homes');
        }
        else {
            res.render('store/homeDetail', { home: home, pageTitle: 'home details', currentPage: 'home', isLoggedIn: req.isLoggedIn, user: req.session.user });
        }
    });
};

exports.getBookings = (req, res, next) => {
    res.render('store/bookings', {
        bookings: [], // Empty array for now - can be populated later with actual booking data
        pageTitle: 'My bookings',
        currentPage: 'bookings',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user
    });
};


exports.getFavouriteList = async (req, res, next) => {
    const userId = req.session.user._id;
    let user = await User.findById({ _id: userId });
    if (!user.favourites) {
        user.favourites = []
    }
    else {
        user = await user.populate('favourites')
    }
    res.render('store/favouriteList', { favouriteHomes: user.favourites, pageTitle: 'My favourites', currentPage: 'favourites', isLoggedIn: req.isLoggedIn, user: req.session.user });

};

exports.AddToFavourites = async (req, res, next) => {
    const userId = req.session.user._id;
    const homeId = req.body.id;
    const user = await User.findById({ _id: userId });
    if (user.favourites.includes(homeId)) {
        console.log("Favourite already added");
    }
    else {
        user.favourites.push(homeId);
        user.save()
            .then(() => {
                console.log("Added to favourites")
            })
            .catch(error => {
                console.log("Favourite added status", error);
            })
    }
    return res.redirect('/store/favourites');
};

exports.DeleteFromFavourites = async (req, res, next) => {
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    const homeId = req.params.homeId;
    user.favourites = user.favourites.filter(favouriteId => favouriteId.toString() !== homeId);
    await user.save();
    res.redirect('/store/favourites');
}

exports.getRulesPdf = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    const homeId = req.params.homeId;
    const home = await Home.findById(homeId);
    const rulesPdf = home.rulesPdf;
    const rulesPdfPath = path.join(rootDir, rulesPdf.replace('/uploads/', 'uploads/'))
    res.download(rulesPdfPath, 'Rules.pdf');
}