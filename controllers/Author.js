const Author        = require('../models/author')
const Category      = require('../models/category')
const validate      = require('../validates/author')
const validateQuote = require('../validates/quote')
const slugify       = require('slugify')
const Quote         = require('../models/quote')

async function index(req,res){
    let page = parseInt(req.query.page ? req.query.page : 1)
    let limit = parseInt(req.query.limit ? req.query.limit : 5)
    try{
        const authors = await Author.find().sort({createAt:-1})
        res.render('author/index', {
            page,
            limit,
            end:Math.ceil(authors.length/limit),
            authors:authors.slice((page-1)*limit,page*limit), 
            message:req.flash()
        })
    }catch(e){
        return res.send('please, refresh your page')
    }
}
function create(req,res){
    res.render('author/create', {errors:{}, author:new Author})
}
async function store(req,res){
    const newAuthor = new Author({
        name:req.body.name,
        about:req.body.about,
        slug: slugify(req.body.name,{lower: true,strict: true})
    })
    const errors = validate(req.body)
    if(Object.keys(errors).length !== 0){
        return res.render('author/create', {errors,author:newAuthor})
    }
    try{
        await newAuthor.save()
        req.flash('create',"success to be add")
        res.redirect(`/author/${newAuthor.slug}`)
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function show(req,res){
    let page = parseInt(req.query.page ? req.query.page : 1)
    let limit = parseInt(req.query.limit ? req.query.limit : 5)
    try{
        const author = await Author.findOne({slug:req.params.slug})
        if(author == null) return res.redirect('/error/pagenotfound')
        try{
            const quotes = await Quote.find({author:author.id}).sort({createAt:-1}).populate('category').exec()
            res.render('author/detail', {
                page,
                limit,
                end:Math.ceil(quotes.length/limit),
                quotes:quotes.slice((page-1)*limit,page*limit),
                total:quotes.length,
                author,
                message:req.flash()
            })
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function edit(req,res){
    try{
        const author = await Author.findOne({slug:req.params.slug})
        if(author == null) return res.redirect('/error/pagenotfound')
        res.render('author/edit', {errors:{},author})
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function update(req,res){
    try{
        const author = await Author.findOne({slug:req.params.slug})
        if(author == null) return res.redirect('/error/pagenotfound')
        author.name = req.body.name
        author.about = req.body.about
        const errors = validate(req.body)
        if(Object.keys(errors).length !== 0){
            return res.render('author/edit', {errors,author})
        }
        author.slug = slugify(req.body.name,{lower: true,strict: true})
        try{
            await author.save()
            req.flash('edit',"success to be edit")
            res.redirect(`/author/${author.slug}`)
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function destroy(req,res){
    try{
        const author = await Author.findOne({slug:req.params.slug})
        if(author == null) return res.redirect('/error/pagenotfound')
        try{
            const quotes = await Quote.find({author:author.id})
            console.log(author.id)
            console.log(quotes.length)
            if(quotes.length > 0){
                req.flash('delete',`${author.name} cannot to be delete`)
                return res.redirect('/author')
            }else{
                try{
                    await Author.deleteOne({ slug: req.params.slug });
                    req.flash('delete',`${author.name} success to be delete`)
                    res.redirect('/author')
                }catch(e){
                    return res.send('please, refresh your page')
                }
            }
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function createQuote(req,res){
    try{
        const author = await Author.findOne({slug:req.params.slug})
        if(author == null) return res.redirect('/error/pagenotfound')
        try{
            const categories = await Category.find()
            res.render('author/createQuote', {errors:{}, quote:new Quote,author, categories})
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function storeQuote(req,res){
    const newQuote = new Quote({
        author:req.body.author,
        category:req.body.category,
        name:req.body.name
    })
    const errors = validateQuote(req.body)
    if(Object.keys(errors).length !== 0){
        try{
            const author = await Author.findOne({slug:req.params.slug})
            if(author == null) return res.redirect('/error/pagenotfound')
            try{
                const categories = await Category.find()
                return res.render('author/createQuote', {errors, quote:newQuote, author, categories})
            }catch(e){
                return res.send('please, refresh your page1')
            }
        }catch(e){
            return res.send('please, refresh your page1')
        }
    }
    try{
        await newQuote.save()
        req.flash('create',"success to be add")
        res.redirect(`/author/${req.params.slug}`)
    }catch(e){
        console.log(e)
        return res.send('please, refresh your page3')
    }
}
async function editQuote(req,res){
    try{
        const author = await Author.findOne({slug:req.params.slug})
        console.log(author)
        // if(author == null) return res.redirect('/error/pagenotfound')
        try{
            const quote = await Quote.findOne({id:req.params.quote})
            console.log('==quote==')
            console.log(quote)
            console.log('==quote==')
            // if(quote == null) return res.redirect('/error/pagenotfound')
            try{
                const categories = await Category.find()
                res.render('author/editQuote', {errors:{}, quote,author, categories})
            }catch(e){
                return res.send('please, refresh your page')
            }
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function updateQuote(req,res){
    try{
        const quote = await Quote.findOne({_id:req.params.quote})
        // if(quote == null) return res.redirect('/error/pagenotfound')
        quote.name = req.body.name
        quote.author = req.body.author
        quote.category = req.body.category
        const errors = validateQuote(req.body)
        if(Object.keys(errors).length !== 0){
            try{
                const author = await Author.findOne({slug:req.params.slug})
                // if(author == null) return res.redirect('/error/pagenotfound')
                if(author == null) return res.redirect('/error/pagenotfound')
                try{
                    const categories = await Category.find()
                    return res.render('author/editQuote', {errors,quote,author,categories})
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
            res.redirect(`/author/${req.params.slug}`)
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function destroyQuote(req,res){
    try{
        const quote = await Quote.findOne({_id:req.params.quote})
        // if( quote == null ) return res.redirect('/error/pagenotfound')
        try{
            await quote.deleteOne({ _id: req.params.id });
            req.flash('delete',"success to be delete")
            res.redirect(`/author/${req.params.slug}`)
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}

module.exports = {index,create,store,show,edit,update,destroy,createQuote,storeQuote,editQuote,updateQuote,destroyQuote}