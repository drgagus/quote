const express       = require('express')
const route         = express.Router()
const {home,about}  = require('../controllers/Index')

route.get('/', home)
route.get('/about', about)

module.exports = route