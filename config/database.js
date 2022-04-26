const mongoose          = require('mongoose')

mongoose.connect(process.env.dbConnect || "mongodb://localhost/myquote")