module.exports = (request) =>{
    errors = {}
    if(request.name=='') errors.name = 'empty' 
    if(request.about=='') errors.about = 'empty'
    return errors 
}