function form(req,res){
    let message = ''
    if (req.session.messages){ message = req.session.messages[req.session.messages.length-1]}
    res.render('auth/login',{message:message})
}
function login(req,res){
    res.redirect('/author')
}
function logout(req,res){
    req.session.destroy((err)=>{
        if (err) throw err
        res.redirect('/')
    })
}

module.exports = {form,login,logout}