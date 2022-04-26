const Author        = require('../models/author')
const Category      = require('../models/category')
const Quote         = require('../models/quote')
const fs            = require('fs')
const pathskills    = 'about/skills'
const paththanks    = 'about/thanks'
const pathprojects  = 'about/projects'
const {hashPassword, comparePassword} = require('../config/hash')

async function home(req,res){
    // const hash = hashPassword('agus')
    // console.log(hash)
    // console.log(comparePassword('agus',hash))
    const isLogin = (req.user) ? true : false
    let quotes = []
    try{
        const categories = await Category.find()
        for(c=0;c<categories.length;c++){
            try{
                let all = await Quote.find({category:categories[c].id})
                const randy = Math.floor((Math.random()*(all.length-0))+0)
                try{
                    let quote = await Quote.findOne({category:categories[c].id}).skip(randy).populate('author').exec()
                    if(quote !== null)  quotes.push(quote)
                }catch(e){
                    return res.send('please, refresh your page')
                }
            }catch(e){
                return res.send('please, refresh your page')
            }
        }
        res.render('index', {quotes,isLogin})
    }catch(e){
        return res.send('please, refresh your page')
    }
}

function about(req,res){
    const isLogin = (req.user) ? true : false
    const skills = fs.readdirSync(`assets/${pathskills}`).map(skill=>{
        return `${pathskills}/${skill}`
    })
    const thanks = fs.readdirSync(`assets/${paththanks}`).map(thank=>{
        return `${paththanks}/${thank}`
    })
    const projects = fs.readdirSync(`assets/${pathprojects}`).map(project=>{
        return `${pathprojects}/${project}`
    })
    return res.render('about', {isLogin,skills,thanks,projects})
}
module.exports = {home, about}