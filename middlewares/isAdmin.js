const User = require("../models/user")

module.exports = async(req,res,next)=>{
    if(req.user){
        try{
            const userDB = await User.findOne({_id:req.user._id})
            if(userDB.role == 'admin'){
                next()
            }else{
                return res.redirect('/error/unauthorize')
            }
        }catch(e){
            return res.redirect('/error/forbidden')
        }
    }else{
        return res.redirect('/error/unauthorize')
    }
}