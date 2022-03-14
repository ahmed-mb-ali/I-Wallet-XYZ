let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
const nodemailer = require('nodemailer');


// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

const GenerateOTP = (email) => {
    const otpGenerator = require('otp-generator')
    return otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
};

const addMinutes = (date, minutes) => {
    return new Date(date + minutes * 60000);
}



const SendEmailOTP = async (emailAddress, OTP) => {
    ///LOGIC to send otp code to email
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'Njobedari@gmail.com',
            pass: 'Newemail2022'
        }
    });

    let message = {
        from: "Njobedari@gmail.com",
        to: emailAddress,
        subject: "OTP",
        html: `<h1>Hello . OTP Code is ${OTP}</h1>`
        // html: `<p>Hello. ${OTP}</p>`
    }

    let result = await transporter.sendMail(message);
    return result;
};


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

module.exports.processLoginPage = async (req, res, next) => {
    passport.authenticate('local',
        async (err, user, info) => {
            // server err?
            if (err) {
                return next(err);
            }
            // is there a user login error?
            if (!user) {
                req.flash('loginMessage', 'Authentication Error');
                return res.redirect('/login');
            }
            req.login(user,async (err) => {
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

                if (user.OTPType == 'email')
                {
                    const user = await User.findByUsername(req.user.username);
                    user.OTPResult = false;
                    await User.updateOne({ _id: user.id }, user, { upsert: false });

                    return res.redirect('/emailOTP');
                }

                return res.redirect('/home');

            });
        })(req, res, next);
}



module.exports.displayEmailOTPPage = async (req, res, next) => {
    // check if the user is not already logged in
    if (req.user) {
        const otp = GenerateOTP(req.user.email);

        let user = await User.findByUsername(req.user.username);
        user.EmailOTP = otp;
        user.EmailOTPExpires = addMinutes(Date.now(), 10);
        user.OTPResult = false;



        // delete upsertData._id;

        await User.updateOne({ _id: user.id }, user, { upsert: false }, (err) => {
            let a = 1;
        });




        await SendEmailOTP(req.user.email, otp);

        res.render('auth/EmailOTP',
            {
                title: 'EmailOTP',
                messages: req.flash('registerMessage'),
                emailAddress: req.user.email,
                displayName: req.user ? req.user.displayName : ''
            });
    }
    else {
        return res.redirect('/login');
    }
}


module.exports.processEmailOTP = async (req, res, next) => {
    if (req.user) {

        const user = await User.findByUsername(req.user.username);

        if (user && user.EmailOTP == req.body.emailVerification && user.EmailOTPExpires > Date.now()) {

            user.EmailOTP = "";
            user.OTPResult = true;

            var result = await User.updateOne({ _id: user.id }, user, { upsert: false });

            return res.redirect('/home');
        }
        else {
            req.flash('registerMessage', 'Bad Data');
            res.render('auth/EmailOTP',
                {
                    messages: 'EmailOTP',
                    messages: req.flash('registerMessage'),
                    emailAddress: req.user.email,
                    displayName: req.user ? req.user.displayName : ''
                });
        }
    }
    else {
        return res.redirect('/login');
    }
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
        displayName: req.body.displayName
    });

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


/* Render the forget password page */
module.exports.forgetPassword = (req,res,next) => {
    res.render('auth/forget_password')
}

/* recover password */
module.exports.recoverPassword = async (req,res,next)=>{
    const email = req.body.email
    const user = await User.findOne({email}, (err, user) => {
        if(err) return
    })
    const userId = user.id
    const url = `localhost:3000/recoverPassword/${userId}`
    SendEmailToRecoverPassword(email, url)
}

const SendEmailToRecoverPassword = async (emailAddress, url) => {
    ///LOGIC to send otp code to email
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'Njobedari@gmail.com',
            pass: 'Newemail2022'
        }
    });

    let message = {
        from: "Njobedari@gmail.com",
        to: emailAddress,
        subject: "Recover your password",
        // html: `<h1>Hello . OTP Code is ${OTP}</h1>
        // html: `<p>Hello, please click the link below to recover your password: <p><a href="${url}">${url}</a></p></p>`,
        html: "<p>Hello, please click the link below to recover your password: <p><a href="+url+">"+url+"</a></p></p>"
    }

    let result = await transporter.sendMail(message);
    return result;
};

module.exports.renderRecoverPasswordPage=(req,res,next)=>{
    const id=req.params.id
    res.render('auth/recoverPassword', {id})
}