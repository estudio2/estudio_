const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const connection = require('../database');
const { matchPassword } = require('../helpers/encrypt');

passport.serializeUser((usuario, done) => {
    done(null, usuario.Id);
});

passport.deserializeUser(async (id, done) => {
    const usuario = await connection.query('SELECT * FROM usuarios WHERE Id = ?', [id])
    done(null, usuario[0]);
});

passport.use('local-signin', new localStrategy({
    usernameField: 'Cuit_Cuil',
    passwordField: 'Contrasenia',
    passReqToCallback: true
}, async (req, Cuit_Cuil, Contrasenia, done) => {
    console.log('Holaa');
    const usuario = await connection.query('SELECT * FROM usuarios WHERE Cuit_Cuil = ?', [Cuit_Cuil]);
    if(!usuario[0]){
        console.log('El usuario no existe');
        return done(null, false, req.flash('error_msg', 'Datos incorrectos'));
    }
    if(!(await matchPassword(Contrasenia, usuario[0].Contrasenia))){
        console.log('Contrasenia incorrecta');
        return done(null, false, req.flash('error_msg', 'Datos incorrectos'));
    }

    return done(null, usuario[0]);
}));