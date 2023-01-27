const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const validateCreate = [

    check('Rol')
    .isIn([1, 2 , 3])
    .withMessage('Rol incorrecto'),

    check('Cuit_Cuil')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Debe ingresar numero de Cuit/Cuil')
    .isNumeric()
    .withMessage('El cuit/cuil debe ser solo numeros')
    .isLength({ min: 11, max: 11 })
    .withMessage('El cuit/cuil debe tener 11 caracteres'),

    check('Nombre')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Debe ingresar nombre'),
    
    (req, res, next) => {
        try{
            validationResult(req).throw();
            return next()
        } catch (err){
            console.log(err.errors[0].msg);
            const datos = {
                Rol: req.body.Rol,
                Cuit_Cuil: req.body.Cuit_Cuil,
                Nombre: req.body.Nombre,
                Apellido: req.body.Apellido
            }
            console.log(datos);
            res.render('usuarios/editar_usuario.ejs', {titulo: 'Inicio', archivo_css: 'usuarios/registrar_usuarios', usuario: req.user, datos: datos, error: err.errors[0].msg, id: req.params.id});
        }
    }
]

module.exports = { validarEdicion: validateCreate }