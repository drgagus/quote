const express       = require('express')
const app           = express()
const ejs           = require('ejs')
const methodoverride= require('method-override')
const flash         = require('connect-flash')
const session       = require('express-session')
const passport      = require('passport')

// route
const errorRoute    = require('./routes/error.js')
const authRoute     = require('./routes/auth.js')
const authorRoute   = require('./routes/author.js')
const categoryRoute = require('./routes/category.js')
const quoteRoute    = require('./routes/quote.js')
// controller
const {home,about}  = require('./controllers/index')

// middleware
const isAdmin       = require('./middlewares/isAdmin')

require('dotenv').config()
const PORT          = process.env.PORT || 8000
const HOST          = process.env.HOST || '127.0.0.1'
require('./config/database')
require('./config/strategies/local')
app.set('view engine', 'ejs')
app.use(express.static('assets'))
app.use(express.urlencoded({extended:false}))
app.use(methodoverride('_method'))
app.use(session({
    secret: process.env.secretkey||'quote',
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/error', errorRoute)
app.use('/auth', authRoute)
app.use('/author', isAdmin, authorRoute)
app.use('/category', isAdmin, categoryRoute)
app.use('/quote', isAdmin, quoteRoute)
app.use('/error', errorRoute)
app.get('/me', about)
app.get('/', home)
app.use('*', (req,res)=>{
    res.redirect('/error/pagenotfound')
})

app.listen(PORT)