let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');
let authController = require('../controllers/authController');
let documentController = require('../controllers/document_controller');

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


var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, file.originalname)
    }
});
  
var upload = multer({ storage: storage });



/* GET home page. */
router.get('/', requireAuth, indexController.displayHomePage);

/* GET home page. */
router.get('/home', requireAuth, indexController.displayHomePage);

/* GET Documents page. */
router.get('/document', requireAuth, documentController.listDocuments);

// Post document page
// driving licence
router.post('/add-document-drivingLicence',
upload.single('drivingLicence'),
documentController.addDocumentDrivingLicence);

// health card
router.post('/add-document-healthCard',
upload.single('healthCard'),
documentController.addDocumentHealthCard);

// ontario id
router.post('/add-document-ontarioId',
upload.single('ontarioId'),
documentController.addDocumentOntarioId);

// passport
router.post('/add-document-passport',
upload.single('passport'),
documentController.addDocumentPassport);

// Update document by id
router.post('/update-document',documentController.updateDocument);

//Delete document by id
router.get('/delete-document',documentController.deleteDocument);

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

module.exports = router;
