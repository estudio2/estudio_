const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const validateCreate = [

    check('Contrasenia')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Complete todos los datos'),

    check('Cuit_Cuil')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Complete todos los datos')
    .isNumeric()
    .withMessage('El cuit/cuil debe ser solo numeros')
    .isLength({ min: 11, max: 11 })
    .withMessage('El cuit/cuil debe tener 11 caracteres'),

    (req, res, next) => {
        try{
            validationResult(req).throw();
            return next()
        } catch (err){
            console.log(err.errors[0].msg);
            console.log(req.body);
            req.flash('error_msg', err.errors[0].msg)
            res.redirect('/iniciar_sesion')
        }
    }
]

module.exports = { validarInicioSesion: validateCreate }