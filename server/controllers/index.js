let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');




// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

module.exports.displayHomePage = (req,res, next) => {
    res.render('home',{title: 'Home', displayName: req.user ? req.user.displayName : '' });
}

module.exports.displayDocumentPage = (req,res, next) => {
    res.render('document', { title: 'Document', displayName: req.user ? req.user.displayName : '' });
}

module.exports.displayNotificationPage = (req,res, next) => {
    res.render('notification', { title: 'Notification', displayName: req.user ? req.user.displayName : '' });
}

module.exports.displayUserProfilePage = (req,res, next) => {
    res.render('userProfile', { title: 'User Profile', displayName: req.user ? req.user.displayName : '' });
}

module.exports.displayCustomerCarePage = (req,res, next) => {
    res.render('customerCare', { title: 'Customer Care', displayName: req.user ? req.user.displayName : ''});
}
