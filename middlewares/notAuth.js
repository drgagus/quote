const User = require("../models/user")

module.exports = async(req,res,next)=>{
    if(req.user){
        return res.redirect('/error/unauthorize')
    }else{
        next()
    }
}