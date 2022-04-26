const bcrypt        = require('bcrypt');
const saltRounds    = 10;

function hashPassword(plaintext){
    return bcrypt.hashSync(plaintext, saltRounds)
}

function comparePassword(plaintext, hashtext) {
    return bcrypt.compareSync(plaintext, hashtext)
}
module.exports = {hashPassword, comparePassword}