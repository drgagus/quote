function error(req,res){
    res.render('error/index')
}
function unauthorize(req,res){
    res.render('error/unauthorize')
}
function pagenotfound(req,res){
    res.render('error/pagenotfound')
}
function forbidden(req,res){
    res.render('error/forbidden')
}

module.exports = {error,unauthorize,pagenotfound,forbidden}