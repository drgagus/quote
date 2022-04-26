const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    theme:{
        type: String,
        required: true,
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

module.exports = mongoose.model('category', categorySchema)