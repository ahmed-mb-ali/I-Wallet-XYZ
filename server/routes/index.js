let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');
let authController = require('../controllers/authController');

// helper function for guard purposes
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    if (req.user.OTPType) {
        if (!req.user.OTPResult) {
            if (req.user.OTPType == "email")
                return res.redirect('/emailOTP');
            else
                return res.redirect('/emailOTP'); ///should change to sms otp
        }

    }
    next();
}



/* GET home page. */
router.get('/', requireAuth, indexController.displayHomePage);

/* GET home page. */
router.get('/home', requireAuth, indexController.displayHomePage);

/* GET Documents page. */
router.get('/document', requireAuth, indexController.displayDocumentPage);

/* GET Notification page. */
router.get('/notification', indexController.displayNotificationPage);

/* GET User Profile page. */
router.get('/userProfile', indexController.displayUserProfilePage);

/* GET Customer Care page. */
router.get('/customerCare', indexController.displayCustomerCarePage);

/* GET Route for displaying the Login page */
router.get('/login', authController.displayLoginPage);

/* POST Route for processing the Login page */
router.post('/login', authController.processLoginPage);

/* GET Route for displaying the Register page */
router.get('/register', authController.displayRegisterPage);

/* POST Route for processing the Register page */
router.post('/register', authController.processRegisterPage);

/* GET Route for sending email otp */
router.get('/emailOTP', authController.displayEmailOTPPage);

/* POST Route for sending email otp */
router.post('/emailOTP', authController.processEmailOTP);

/* GET to perform UserLogout */
router.get('/logout', authController.performLogout);

/* GET: render reset password page */
router.get('/forgetPassword', authController.forgetPassword)

/* POST: recover password */
router.post('/recoverPassword', authController.recoverPassword)
/* GET: render recover password page */
router.get('/recoverPassword/:id', authController.renderRecoverPasswordPage)




module.exports = router;
