const { application } = require('express');
const connection = require('../database');
const { encryptPassword } = require('../helpers/encrypt');
const { guardarEnRegistro } = require('../helpers/registroAuditoria');

class UsuarioController{

    mostrarFormularioRegistro(req, res){
        const datos = {
            Rol: '',
            Cuit: '',
            Nombre: '',
            Mail: ''
        }

        const usuario = UsuarioController.verificarSiHayUsuario(req);

        res.render('usuarios/registrar_usuario.ejs', {titulo: 'Inicio', archivo_css: 'usuarios/registrar_usuarios', usuario, datos, error :undefined})
    }


    async RegistrarUsuario(req, res){
        try{

        const usuario = UsuarioController.verificarSiHayUsuario(req);
        const {Nombre, Apellido, Cuit_Cuil, Rol, Mail} = req.body;

        if(Rol == 3){
            if(usuario.Rol != 3){
                return res.send('Error');
            }
        }

        const Contrasenia = await encryptPassword('123'); /* La Contrasenia se crea de forma predeterminada para todos los
                                                            usuarios. La primera vez que inicien sesion se les solicitara
                                                            que ingresen una nueva. */

        const Version = 1;  // La version inicial es 1 (La cual indica que el usuario todavia no cambio la Contrasenia predeterminada)

        const nuevoUsuario = {Cuit_Cuil, Nombre, Rol, Contrasenia, Version, Mail};

        const existe = await UsuarioController.buscarSiExiste(Cuit_Cuil);
        if(existe){
            const error = 'Ya existe un usuario con ese Cuit/Cuil';
            return res.render('usuarios/registrar_usuario.ejs', {titulo: 'Inicio', archivo_css: 'usuarios/registrar_usuarios', usuario, datos: nuevoUsuario, error: error});
        }

        await connection.query('INSERT INTO usuarios set ?', [nuevoUsuario]);

        console.log('usuario registrado');

        const descripcion = req.user.Nombre + " creo un usuario para " + Nombre + "(" + Cuit_Cuil + ")";
        await guardarEnRegistro(req, descripcion);

        req.flash('succes_msg', 'Usuario Creado');
        res.redirect('registrar_usuario');

        }catch(err){
            console.log(err);
            res.send('Algo salio mal');
        }
    }


    mostrarFormularioInicioSesion(req, res){
        res.render('usuarios/iniciar_sesion.ejs', {titulo: 'Inicio_Sesion', archivo_css: 'usuarios/registrar_usuarios', usuario: undefined});
    }


    async verUsuarios(req, res){
    
        try{

            const usuario = UsuarioController.verificarSiHayUsuario(req);

            if(usuario){
                if(req.params.rol == 3){
                    if(usuario.Rol != 3){
                        return res.send('No se poseen los permisos necesarios');
                    }
                }
            }

            const usuarios = await UsuarioController.obtenerUsuarios(req);
            usuarios.reverse();

            res.render('usuarios/ver_usuarios.ejs', {titulo: 'Usuarios', archivo_css: 'usuarios/ver_usuarios', usuario, usuarios, rol: req.params.rol});        

        }catch(err){
            res.send('Error');
        }
        
    }


    redirigirAVerUsuarios(req, res){
        const rol = req.params.rol
        const filtro = req.body.Filtro;
        res.redirect('/ver_usuarios/' + rol + "/" + filtro);
    }

    async mostrarFormularioEdicion(req, res){

        const u = await connection.query('SELECT * FROM usuarios WHERE Id = ?', [req.params.id]);

        if(u[0] == undefined){
            res.send('error');
        }
        const datos = u[0]

        const usuario = UsuarioController.verificarSiHayUsuario(req);
        res.render('usuarios/editar_usuario.ejs', {titulo: 'Editar Usuario', archivo_css: 'usuarios/registrar_usuarios', usuario, datos, error :undefined, id: req.params.id})
    }

    async editarUsuario(req, res){

        try{

            const usuario = UsuarioController.verificarSiHayUsuario(req);
            const {Nombre, Apellido, Cuit_Cuil, Rol, Mail, Contrasenia} = req.body;

            if(Rol == 3){
                if(usuario.Rol != 3){
                    return res.send('Error');
                }
            }

            const u = await connection.query('SELECT * FROM usuarios WHERE Id = ?', [req.params.id]);

            const usuarioEditado = {
                Nombre,
                Rol,
                Cuit_Cuil,
                Mail,
            }

            const existe = await UsuarioController.buscarSiExiste(Cuit_Cuil);
            if(existe){
                if(req.params.id != existe.Id){
                    const error = 'Ya existe un usuario con ese Cuit/Cuil';
                    return res.render('usuarios/editar_usuario.ejs', {titulo: 'Inicio', archivo_css: 'usuarios/registrar_usuarios', usuario, datos: usuarioEditado, error: error, id: req.params.id});
                }
            }


            if(Contrasenia == 'si'){
                console.log('Reiniciar contrasenia');
                const Contrasenia = await encryptPassword('123');
                usuarioEditado.Contrasenia = Contrasenia;
                usuarioEditado.Version = 1;
            }else{
                usuarioEditado.Contrasenia = u[0].Contrasenia;
            }

            console.log(usuarioEditado);
            await connection.query('UPDATE usuarios set ? WHERE Id = ?', [usuarioEditado, req.params.id]);

            const descripcion = req.user.Nombre + " edito un usuario " + u[0].Nombre + "(" + u[0].Cuit_Cuil + "), y este quedo como " + Nombre + "(" + Cuit_Cuil + ")";
            await guardarEnRegistro(req, descripcion);

            req.flash('succes_msg', 'Usuario editado');
            res.redirect('/ver_usuarios/1');

        }catch(err){
            console.log(err);
            res.send('Hubo un error');
        }



    }


    async eliminarUsuario(req, res){

        try{

            await connection.query('DELETE FROM usuarios WHERE Id = ?', [req.params.id]);
            const descripcion = req.user.Nombre + " elimino un usuario con Cuil/Cuit: " + req.params.cuit_cuil;
            await guardarEnRegistro(req, descripcion);
            req.flash('succes_msg', 'Usuario eliminado');
            res.redirect('/ver_usuarios/1');

        }catch(err){

            console.log(err);
            res.send('Error');

        }

    }

    mostrarFormularioClave(req, res){

        const usuario = UsuarioController.verificarSiHayUsuario(req);

        res.render('usuarios/cambio_clave.ejs', {titulo: 'Cambiar contraseña', archivo_css: 'usuarios/cambio_clave', usuario})
    }

    async cambiarClave(req, res){

        const usuario = UsuarioController.verificarSiHayUsuario(req);

        const {Clave} = req.body;
        const ClaveEncriptada = await encryptPassword(Clave);
        const usuarioEditado = {
            Version: 2,
            Contrasenia: ClaveEncriptada
        }

        await connection.query('UPDATE usuarios set ? WHERE Id = ?', [usuarioEditado, req.user.Id]);
        console.log('Clave cambiada')
        req.flash('succes_msg', 'ClaveActualizada');

        res.redirect('/');
    }



    /*
        Aca arrancan los metodos estaticos
    */

    static async obtenerUsuarios(req){

        const usuarios = await connection.query('SELECT * FROM usuarios WHERE Rol = ?', [req.params.rol]);

        if(req.params.filtro){
            const filtro = req.params.filtro.toLowerCase();
            const usuariosFiltrados = [];
            
            if(isNaN(filtro)){

                console.log('es string')
                let nombre;

                usuarios.forEach((usuario) => {
                    
                    nombre = usuario.Nombre.toLowerCase();
                    console.log(nombre);
                    if(nombre.includes(filtro)){
                        usuariosFiltrados.push(usuario);
                    }
                });

                return usuariosFiltrados;

            }else{

                console.log('es numero')
                usuarios.forEach((usuario) => {
                    if(usuario.Cuit_Cuil.includes(filtro)){
                        usuariosFiltrados.push(usuario);
                    }
                });

                return usuariosFiltrados;
            }
        }

        return usuarios;
    }


    static async buscarSiExiste(cuit_cuil){

        const usuario = await connection.query('SELECT * FROM usuarios WHERE Cuit_Cuil = ?', [cuit_cuil]);
        if(!(usuario[0] === undefined)){
            console.log(usuario[0]);
            console.log('--------------------------');
            return usuario[0];
        }
        return undefined;
    }


    static verificarSiHayUsuario(req){
        if(req.user){
            return req.user
        }
        return undefined
    }

}

module.exports = UsuarioController;