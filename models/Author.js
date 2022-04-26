const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    about:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('author', authorSchema)