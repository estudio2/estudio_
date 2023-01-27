
const helpers = {};

helpers.compararClaves = (req, res, next) => {
    
    if(req.body.Clave == req.body.Clave2) {
      return next();
    } 
    req.flash('error_msg', 'Las claves deben ser iguales');
    return res.redirect('/cambio_clave')
}


module.exports = helpers;