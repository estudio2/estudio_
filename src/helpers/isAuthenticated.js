const passport = require('passport');
const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    
    if(req.isAuthenticated()) {
      return next();
    }
  
    return res.redirect('/iniciar_sesion')
}

module.exports = helpers;