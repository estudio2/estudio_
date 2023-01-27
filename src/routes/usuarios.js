const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const identificadorRol = require('../helpers/identificadorRol');
const { compararClaves } = require('../helpers/compararClaves');
const { revisarVersion } = require('../helpers/revisarVersion');

const router = express.Router();
const { validarRegistro } = require('../validators/Usuarios');
const { validarInicioSesion } = require('../validators/UsuarioInicioSesion');
const { validarEdicion } = require('../validators/EdicionUsuario');
const { validarClave } = require('../validators/Clave');

const usuarios_controller = require('../controllers/usuarios_controller.js');
const controller = new usuarios_controller;

router.get('/ver_usuarios/:rol/:filtro?', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.verUsuarios);

router.post('/ver_usuarios/:rol', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.redirigirAVerUsuarios);

router.get('/registrar_usuario', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.mostrarFormularioRegistro);

router.post('/registrar_usuario', isAuthenticated, identificadorRol.esMiembro, revisarVersion, validarRegistro, controller.RegistrarUsuario);

router.get('/editar_usuario/:id', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.mostrarFormularioEdicion);  

router.post('/editar_usuario/:id', isAuthenticated, identificadorRol.esMiembro, revisarVersion, validarEdicion, controller.editarUsuario);

router.get('/eliminar_usuario/:id/:cuit_cuil', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.eliminarUsuario);

router.get('/cambio_clave', isAuthenticated, controller.mostrarFormularioClave);

router.post('/cambio_clave', isAuthenticated, validarClave,  compararClaves, controller.cambiarClave);

router.get('/iniciar_sesion', controller.mostrarFormularioInicioSesion);  
  
router.post('/iniciar_sesion', validarInicioSesion, passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/iniciar_sesion',
    failureFlash: true
}));

router.get('/cerrar_sesion', isAuthenticated, async(req, res, next) => {
  
  req.logout(function(err) {
    if (err) { 
      return send('Error'); 
      }
    
    console.log('Sesion Cerrada');
    res.redirect('/');
  });
});




module.exports = router;