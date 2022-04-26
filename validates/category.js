module.exports = (request) =>{
    errors = {}
    if(request.name=='') errors.name = 'empty'
    if(request.theme=='') errors.theme = 'empty'
    return errors 
}