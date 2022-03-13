let userModel = require('../models/user');
let User = userModel.User
const CODE=require('./code_meaning')


module.exports.resetPassword = (req,res,next)=>{
    const email=req.body.email
    User.findOneAndUpdate({email}, {$set:{
            password: CODE.ORIGINAL_PASSWORD
        }}, {}, (err, user)=>{
        if(err) console.log(CODE.SERVER_ERROR)
        else if(!user) console.log(CODE.NO_USER)
        else res.send(CODE.MODIFY_DONE)
    })
}
