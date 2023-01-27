const express = require('express');
const { isAuthenticated } = require('../helpers/isAuthenticated');
const identificadorRol = require('../helpers/identificadorRol');
const { revisarVersion } = require('../helpers/revisarVersion');

const router = express.Router();

const { validarCarpeta } = require('../validators/Carpeta');

const carpetas_controller = require('../controllers/carpetas_controller.js');
const controller = new carpetas_controller;


router.get('/crear_carpeta', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.mostrarFormularioCarpeta);

router.post('/crear_carpeta', isAuthenticated, identificadorRol.esMiembro, validarCarpeta, revisarVersion, controller.crearCarpeta);

router.get('/ver_carpetas/:soloMias/:filtro?', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.mostrarCarpetas);

router.post('/ver_carpetas', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.redirigirAVerCarpetas);

router.get('/ver_carpeta/:id', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.verCarpeta);

router.post('/editar_carpeta/:id', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.editarCarpeta);

router.get('/eliminar_carpeta/:id/:num', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.eliminarCarpeta);

router.post('/crear_estado/:id/:num/:mail/:etiqueta', isAuthenticated, identificadorRol.esMiembro, revisarVersion, controller.crearEstado);

router.get('/mis_carpetas/:id', isAuthenticated, identificadorRol.esCliente, revisarVersion, controller.MisCarpetasCliente);

router.get('/ver_mi_carpeta/:id/:num', isAuthenticated, identificadorRol.esCliente, revisarVersion, controller.verMiCarpetaCliente);





module.exports = router;