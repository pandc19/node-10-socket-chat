const generarJWT = require('./generar-jwt');
const dbValidators = require('./db-validators');
const googleVerify = require('./google-verify');


module.exports = {
    ...generarJWT,
    ...dbValidators,
    ...googleVerify
}