const Category      = require('../models/category')
const Quote         = require('../models/quote')
const validate      = require('../validates/category')
const validateQuote = require('../validates/quote')
const slugify       = require('slugify')
const Author        = require('../models/author')

async function index(req,res){
    try{
        const categories = await Category.find()
        res.render('category/index',{categories,message:req.flash()})
    }catch(e){
        return res.send('please, refresh your page')
    }
}
function create(req,res){
    res.render('category/create', {errors:{}, category: new Category})
}
async function store(req,res){
    const newCategory = new Category({
        name:req.body.name,
        theme:req.body.theme,
        slug: slugify(req.body.name,{lower: true,strict: true})
    })
    const errors = validate(req.body)
    if(Object.keys(errors).length !== 0){
        return res.render('category/create', {errors,category:newCategory})
    }
    try{
        await newCategory.save()
        req.flash('create',"success to be add")
        res.redirect('/category')
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function show(req,res){
    let page = parseInt(req.query.page ? req.query.page : 1)
    let limit = parseInt(req.query.limit ? req.query.limit : 5)
    try{
        const category = await Category.findOne({slug:req.params.slug})
        if( category == null ) return res.redirect('/error/pagenotfound')
        try{
            const quotes = await Quote.find({category:category.id}).sort({createAt:-1}).populate('author').exec()
            res.render('category/detail', {
                page,
                limit,
                end:Math.ceil(quotes.length/limit),
                quotes:quotes.slice((page-1)*limit,page*limit),
                total:quotes.length,
                category,
                message:req.flash()
            })
        }catch(e){
            return res.send('please, refresh your page2')
        }
    }catch(e){
        return res.send('please, refresh your page1')
    }
}
async function edit(req,res){
    try{
        const category = await Category.findOne({slug:req.params.slug})
        if( category == null ) return res.redirect('/error/pagenotfound')
        res.render('category/edit', {errors:{}, category})
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function update(req,res){
    try{
        const category = await Category.findOne({slug:req.params.slug})
        if( category == null ) return res.redirect('/error/pagenotfound')
        category.name = req.body.name
        category.theme = req.body.theme
        const errors = validate(req.body)
        if(Object.keys(errors).length !== 0){
            return res.render('category/edit', {errors,category})
        }
        category.slug = slugify(req.body.name,{lower: true,strict: true})
        try{
            await category.save()
            req.flash('edit',"success to be edit")
            res.redirect('/category')
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
async function destroy(req,res){
    try{
        const category = await Category.findOne({slug:req.params.slug})
        if( category == null ) return res.redirect('/error/pagenotfound')
        try{
            const quotes = await Quote.find({category:category.id})
            if(quotes.length >0){
                req.flash('delete',"cannot to be delete")
                res.redirect('/category')
            }else{
                try{
                    await Category.deleteOne({ slug: req.params.slug });
                    req.flash('delete',"success to be delete")
                    res.redirect('/category')
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
        const category = await Category.findOne({slug:req.params.slug})
        if( category == null ) return res.redirect('/error/pagenotfound')
        try{
            const authors = await Author.find()
            res.render('category/createQuote', {errors:{}, quote:new Quote,category, authors})
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
            const category = await Category.findOne({slug:req.params.slug})
            if( category == null ) return res.redirect('/error/pagenotfound')
            try{
                const authors = await Author.find()
                return res.render('category/createQuote', {errors, quote:newQuote, authors, category})
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
        res.redirect(`/category/${req.params.slug}`)
    }catch(e){
        console.log(e)
        return res.send('please, refresh your page3')
    }
}
async function editQuote(req,res){
    try{
        const category = await Category.findOne({slug:req.params.slug})
        // if( category == null ) return res.redirect('/error/pagenotfound')
        try{
            const quote = await Quote.findOne({_id:req.params.quote})
            // if( quote == null ) return res.redirect('/error/pagenotfound')
            try{
                const authors = await Author.find()
                res.render('category/editQuote', {errors:{}, quote,category, authors})
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
        // if( quote == null ) return res.redirect('/error/pagenotfound')
        quote.name = req.body.name
        quote.author = req.body.author
        quote.category = req.body.category
        const errors = validateQuote(req.body)
        if(Object.keys(errors).length !== 0){
            try{
                const category = await Category.findOne({slug:req.params.slug})
                // if( category == null ) return res.redirect('/error/pagenotfound')
                try{
                    const authors = await Author.find()
                    return res.render('category/editQuote', {errors,quote,category,authors})
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
            res.redirect(`/category/${req.params.slug}`)
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
            res.redirect(`/category/${req.params.slug}`)
        }catch(e){
            return res.send('please, refresh your page')
        }
    }catch(e){
        return res.send('please, refresh your page')
    }
}
module.exports = {index,create,store,show,edit,update,destroy,createQuote,storeQuote,editQuote,updateQuote,destroyQuote}