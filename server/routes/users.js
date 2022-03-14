var express = require('express');
var router = express.Router();
const user_controller=require('../controllers/users_controller')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*POST: reset password by id*/
router.post('/recoverPassword', user_controller.renderRecoverPassword)

module.exports = router;
