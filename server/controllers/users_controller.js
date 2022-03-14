let userModel = require('../models/user');
let User = userModel.User
const CODE=require('./code_meaning')


module.exports.renderRecoverPassword = async (req,res,next)=>{
    const password=req.body.password
    const id=req.body.id
    const user = await User.findById({_id: id}, (err, user) => {if (err) return})

    user.salt=password
    user.save((err, result) => {
        if(err) return
        res.send('Changed successfully!')
    })
}

