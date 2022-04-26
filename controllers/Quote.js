const Author = require('../models/author')
const Category = require('../models/category')
const Quote     = require('./../models/quote')
const validate  = require('./../validates/quote')

async function index(req,res){
    let page = parseInt(req.query.page ? req.query.page : 1)
    let limit = parseInt(req.query.limit ? req.query.limit : 4)
    try{
        const quotes = await Quote.find().sort({createAt:-1}).populate('author').populate('category').exec()
        res.render('quote/index', {
            page,
            limit,
            end:Math.ceil(quotes.length/limit),
            quotes:quotes.slice((page-1)*limit,page*limit),
            total:quotes.length,
            message:req.flash()
        })
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function create(req,res){
    try{
        const authors = await Author.find()
        try{
            const categories = await Category.find()
            res.render('quote/create', {errors:{}, quote:new Quote, authors, categories})
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function store(req,res){
    const newQuote = new Quote({
        author:req.body.author,
        category:req.body.category,
        name:req.body.name
    })
    const errors = validate(req.body)
    if(Object.keys(errors).length !== 0){
        try{
            const authors = await Author.find()
            try{
                const categories = await Category.find()
                return res.render('quote/create', {errors, quote:newQuote, authors, categories})
            }catch(e){
                return res.send('please, refresh your page1')
            }
        }catch(e){
            return res.send('please, refresh your page2')
        }
    }
    try{
        await newQuote.save()
        req.flash('create',"success to be add")
        res.redirect('/quote')
    }catch(e){
        console.log(e)
        return res.send('please, refresh your page3')
    }
}
function show(req,res){
    res.render('quote/detail')
}
async function edit(req,res){
    console.log('---')
    console.log(typeof req.params.id)
    if(typeof req.params.id == 'String' ) console.log('setering')
    console.log('---')
    try{
        const quote = await Quote.findOne({_id:req.params.id})
        console.log(quote)
        if(quote == null) return res.redirect('/error/pagenotfound')
        try{
            const authors = await Author.find()
            try{
                const categories = await Category.find()
                res.render('quote/edit', {errors:{}, quote, authors, categories})
            }catch(e){
                return res.send('please, refresh your page')
            }
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        console.log(e)
        return res.send('please, refresh your page')
    }
}
async function update(req,res){
    try{
        const quote = await Quote.findOne({_id:req.params.id})
        if(quote == null) return res.redirect('/error/pagenotfound')
        quote.name = req.body.name
        quote.author = req.body.author
        quote.category = req.body.category
        const errors = validate(req.body)
        if(Object.keys(errors).length !== 0){
            try{
                const authors = await Author.find()
                try{
                    const categories = await Category.find()
                    return res.render('quote/edit', {errors,quote,authors,categories})
                }catch(e){
                    return res.send('please, refresh your page')
                }
            }catch(e){
                return res.send('please, refresh your page')
            }
        }
        try{
            await quote.save()
            req.flash('edit',"success to be edit")
            res.redirect('/quote')
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function destroy(req,res){
    try{
        const quote = await Quote.findOne({_id:req.params.id})
        if(quote==null) return res.render('error/pagenotfound')
        try{
            await quote.deleteOne({ _id: req.params.id });
            req.flash('delete',"success to be delete")
            res.redirect('/quote')
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}

module.exports = {index,create,store,show,edit,update,destroy}