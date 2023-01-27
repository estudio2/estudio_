const helpers = {};

helpers.esAdministrador = (req, res, next) => {
    console.log(req.user.Rol)
    if(req.user.Rol == 3) {
        console.log('Posee los permisos necesarios')
        return next();
    }
    console.log('No posee los permisos necesarios')
    return res.send('No se poseen los permisos necesarios')
}

helpers.esMiembro = (req, res, next) => {
    console.log(req.user.Rol)
    if(req.user.Rol == 3 || req.user.Rol == 2) {
        console.log('si')
        return next();
    }
    console.log('no')
    return res.send('No se poseen los permisos necesarios')
}

helpers.esCliente = (req, res, next) => {
    console.log(req.user.Rol)
    if(req.user.Rol == 1) {
        console.log('si')
        return next();
    }
    console.log('no')
    return res.send('No se poseen los permisos necesarios')
}

module.exports = helpers;