const { check } = require('express-validator');
const { validationResult } = require('express-validator');
const connection = require('../database');

const validateCreate = [

    check('Clave')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Debe ingresar una clave')
    .isLength({ min: 6, max: 20 })
    .withMessage('La clave debe tener minimo 6 caracteres y maximo 20'),

    check('Clave2')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Debe repetir la clave'),

    
    async (req, res, next) => {
        try{
            validationResult(req).throw();
            return next()
        } catch (err){
            console.log(err.errors[0].msg);
            req.flash('error_msg', err.errors[0].msg);
            res.redirect('/cambio_clave')
        }
    }
]

module.exports = { validarClave: validateCreate }