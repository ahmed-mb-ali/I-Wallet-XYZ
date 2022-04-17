let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');




// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

let DocumentModel = require('../models/document');
const Document = mongoose.model('Document');


module.exports.displayHomePage = (req, res, next) => {
    res.render('home', { isAdmin: req.user ? req.user.isAdmin : false, title: 'Home', displayName: req.user ? req.user.displayName : '' });
}

module.exports.displayDocumentPage = (req, res, next) => {
    res.render('document', { isAdmin: req.user ? req.user.isAdmin : false, title: 'Document', displayName: req.user ? req.user.displayName : '' });
}

module.exports.displayNotificationPage = async (req, res, next) => {
    console.log(req.user._id);
    var document = await Document.findOne({ user: req.user._id }).exec();
    console.log(document);
    var today = new Date();
    let notifications = [];
    todayCount = today.getFullYear() + today.getMonth() + today.getDate();
    console.log(todayCount);
    var containData = false;
    if (document) {
        if (!(typeof document.DLED == 'undefined')) {
            daysCount = document.DLED.getFullYear() + document.DLED.getMonth() + document.DLED.getDate()
            console.log(daysCount);
            containData = true;
            if (daysCount <= todayCount) {
                notifications.push('Your driving license is expired!');
            } else {
                daysDiff = daysCount - todayCount;
                console.log(daysDiff);
                if (daysDiff <= 2) {
                    notifications.push('Your driving license is ' + daysDiff + ' days to be expired!');
                }
            }
        }
        if (!(typeof document.HCED == 'undefined')) {
            daysCount = document.HCED.getFullYear() + document.HCED.getMonth() + document.HCED.getDate()
            console.log(daysCount);
            containData = true;
            if (daysCount <= todayCount) {
                notifications.push('Your health card is expired!');
            } else {
                daysDiff = daysCount - todayCount;
                console.log(daysDiff);
                if (daysDiff <= 2) {
                    notifications.push('Your health card is ' + daysDiff + ' days to be expired!');
                }
            }
        }
        if (!(typeof document.OIED == 'undefined')) {
            daysCount = document.OIED.getFullYear() + document.OIED.getMonth() + document.OIED.getDate()
            console.log(daysCount);
            containData = true;
            if (daysCount <= todayCount) {
                notifications.push('Your Ontario Id is expired!');
            } else {
                daysDiff = daysCount - todayCount;
                console.log(daysDiff);
                if (daysDiff <= 2) {
                    notifications.push('Your Ontario Id is ' + daysDiff + ' days to be expired!');
                }
            }
        }
        if (!(typeof document.PED == 'undefined')) {
            daysCount = document.PED.getFullYear() + document.PED.getMonth() + document.PED.getDate()
            console.log(daysCount);
            containData = true;
            if (daysCount <= todayCount) {
                notifications.push('Your passport is expired!');
            } else {
                daysDiff = daysCount - todayCount;
                console.log(daysDiff);
                if (daysDiff <= 2) {
                    notifications.push('Your passport is ' + daysDiff + ' days to be expired!');
                }
            }
        }
    }
    res.render('notification', {
        title: 'Notification', displayName: req.user ? req.user.displayName : '',
        containData: containData, notifications: notifications
    });
}

module.exports.displayUserProfilePage = (req, res, next) => {
    res.render('userProfile', { title: 'User Profile', displayName: req.user ? req.user.displayName : '' });
}



module.exports.displayLoginPage = (req, res, next) => {
    // check if the user is already logged in
    if (!req.user) {
        res.render('auth/login',
            {
                title: "Login",
                messages: req.flash('loginMessage'),
                displayName: req.user ? req.user.displayName : ''
            })
    }
    else {
        return res.redirect('/');
    }
}

module.exports.processLoginPage = (req, res, next) => {
    passport.authenticate('local',
        (err, user, info) => {
            // server err?
            if (err) {
                return next(err);
            }
            // is there a user login error?
            if (!user) {
                req.flash('loginMessage', 'Authentication Error');
                return res.redirect('/login');
            }
            req.login(user, (err) => {
                // server error?
                if (err) {
                    return next(err);
                }



                /* TODO - Getting Ready to convert to API
                res.json({success: true, msg: 'User Logged in Successfully!', user: {
                    id: user._id,
                    displayName: user.displayName,
                    username: user.username,
                    email: user.email
                }, token: authToken});
                */

                return res.redirect('/home');

            });
        })(req, res, next);
}

module.exports.displayRegisterPage = (req, res, next) => {
    // check if the user is not already logged in
    if (!req.user) {
        res.render('auth/register',
            {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
    }
    else {
        return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    // instantiate a user object
    let newUser = new User({
        username: req.body.username,
        //password: req.body.password
        email: req.body.email,
        phone: req.body.phone,
        displayName: req.body.displayName
    });
    console.log(newUser)

    User.register(newUser, req.body.password, (err) => {
        if (err) {
            console.log("Error: Inserting New User");
            if (err.name == "UserExistsError") {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/register',
                {
                    title: 'Register',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
        }
        else {
            // if no error exists, then registration is successful

            // redirect the user and authenticate them

            /* TODO - Getting Ready to convert to API
            res.json({success: true, msg: 'User Registered Successfully!'});
            */

            return passport.authenticate('local')(req, res, () => {
                res.redirect('/home')
            });
        }
    });
}

module.exports.performLogout = (req, res, next) => {
    req.logout();
    res.redirect('/');
}