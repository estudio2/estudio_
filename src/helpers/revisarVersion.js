
const helpers = {};

helpers.revisarVersion = (req, res, next) => {
    
    if(req.user.Version == 2) {
      return next();
    } 

    return res.redirect('/cambio_clave')
}


module.exports = helpers;