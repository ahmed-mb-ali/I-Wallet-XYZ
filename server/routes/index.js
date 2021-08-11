let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');

// helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
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
router.get('/notification',indexController.displayNotificationPage);

/* GET User Profile page. */
router.get('/userProfile', indexController.displayUserProfilePage);

/* GET Customer Care page. */
router.get('/customerCare', indexController.displayCustomerCarePage);

/* GET Route for displaying the Login page */
router.get('/login', indexController.displayLoginPage);

/* POST Route for processing the Login page */
router.post('/login', indexController.processLoginPage);

/* GET Route for displaying the Register page */
router.get('/register', indexController.displayRegisterPage);

/* POST Route for processing the Register page */
router.post('/register', indexController.processRegisterPage);

/* GET to perform UserLogout */
router.get('/logout', indexController.performLogout);

module.exports = router;
