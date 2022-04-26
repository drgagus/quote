module.exports = (request) =>{
    errors = {}
    if(request.category=='') errors.category = 'empty' 
    if(request.author=='') errors.author = 'empty' 
    if(request.name=='') errors.name = 'empty'
    return errors 
}