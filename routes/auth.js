const express               = require('express')
const route                 = express.Router()
const passport              = require('passport')
const {form,login,logout}   = require('../controllers/auth')
const isAdmin               = require('./../middlewares/isAdmin')
const notAuth               = require('./../middlewares/notAuth')

route.get('/login', notAuth, form)
route.post('/login', passport.authenticate('local', {failureRedirect: '/auth/login', failureMessage: true }), login)
route.post('/logout', isAdmin, logout)

module.exports = route