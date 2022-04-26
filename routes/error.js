const express                   = require('express')
const route                     = express.Router()
const {error,unauthorize,pagenotfound,forbidden}   = require('./../controllers/error')

route.get('/', error)
route.get('/forbidden', forbidden)
route.get('/unauthorize', unauthorize)
route.get('/pagenotfound', pagenotfound)

module.exports = route