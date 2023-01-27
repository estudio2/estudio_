const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const connection = require('../database');

const validateCreate = [


    check('Etiqueta')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Debe ingresar Etiqueta'),

    check('Num')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Debe ingresar Num'),

    
    async (req, res, next) => {
        try{
            validationResult(req).throw();
            return next()
        } catch (err){
            console.log(err.errors[0].msg);
            const datos = {
                Etiqueta: req.body.Etiqueta,
                Num: req.body.Num,
            }
            console.log(datos);
            const clientes = await connection.query('SELECT * FROM usuarios WHERE Rol = 1');
            res.render('carpetas/crear_carpeta.ejs', {titulo: 'Inicio', archivo_css: 'usuarios/registrar_usuarios', usuario: req.user, datos, error :err.errors[0].msg, clientes})
        }
    }
]

module.exports = { validarCarpeta: validateCreate }