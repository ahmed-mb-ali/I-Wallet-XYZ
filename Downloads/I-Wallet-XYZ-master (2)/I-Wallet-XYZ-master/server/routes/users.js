var express = require('express');
var router = express.Router();
const user_controller=require('../controllers/users_controller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/* PATCH reset password by user email */
router.patch('/:email', user_controller.resetPassword)

module.exports = router;
