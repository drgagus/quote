const mongoose = require('mongoose')

const quoteSchema   = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'author'
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'category'
    },
    createAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('quote', quoteSchema)