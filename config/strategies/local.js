const passport      = require('passport')
const { Strategy }  = require('passport-local')
const user = require('./../../models/user')
const User          = require('./../../models/user')
const {hashPassword, comparePassword} = require('./../hash')

passport.serializeUser((userDB,done)=>{
    return done(null,userDB.id)  
    //dari req user pertama, masuk session pertama dan seterusnya
})
passport.deserializeUser(async(userid,done)=>{
    try{
        const userDB = await User.findOne({id:userid})
        return done(null,userDB) //masuk req.user selanjutnya
    }catch(e){
        console.log(`error : ${e}`)
    }
})
passport.use(new Strategy(
    {
        usernameField : 'username',
        passwordField : 'password'
    },
    async (username,password,done)=>{
        if(!username || !password) return done(null,false,{message:'missing credential'})
        try{
            const userDB = await User.findOne({username})
            if(!userDB) return done(null,false,{message:'wrong username'})

            if(comparePassword(password,userDB.password)) return done(null,userDB) 
            //masuk req.user pertama (gak bisa di olah)
            
            return done(null,false,{message:'wrong password'})    

        }catch(e){
            throw new Error(e)
        }
    }
))