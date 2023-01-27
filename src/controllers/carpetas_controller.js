const { application } = require('express');
const connection = require('../database');
const { guardarEnRegistro } = require('../helpers/registroAuditoria');
const nodemailer = require('nodemailer');

class CarpetasController{

    async mostrarFormularioCarpeta(req, res){

        const clientes = await connection.query('SELECT * FROM usuarios WHERE Rol = 1');

        clientes.sort(function compareFn(a, b) {
            if (a.Nombre.toLowerCase() < b.Nombre.toLowerCase()) {
              return -1;
            }
            if (a.Nombre.toLowerCase() > b.Nombre.toLowerCase()) {
              return 1;
            }
          
            return 0;
          });

        const usuario = CarpetasController.verificarSiHayUsuario(req);
        let datos = {};

        res.render('carpetas/crear_carpeta.ejs', {titulo: 'Inicio', archivo_css: 'usuarios/registrar_usuarios', usuario, datos, error :undefined, clientes})

    }

    async crearCarpeta(req,res){
        try{

            const usuario = CarpetasController.verificarSiHayUsuario(req);

            const {Area, Etiqueta, Num, Sector, HBL_HAWB, Cliente, EntidadExterior, Transportista, Origen, Destino, FechaSalida, FechaLlegada} = req.body;

            let arr = Cliente.split("=");
            const IdCliente = arr[0];
            const NombreCliente = arr[1];
            const MailCliente = arr[2];
            const IdCustomer = usuario.Id;
            const NombreCustomer = usuario.Nombre;

            const nuevaCarpeta = {
                Area,
                Num,
                Etiqueta,
                Sector,
                HBL_HAWB,
                NombreCliente,
                IdCliente,
                MailCliente,
                NombreCustomer,
                IdCustomer,
                EntidadExterior, 
                Transportista, 
                Origen, 
                Destino, 
                FechaSalida,
                FechaLlegada
            }

            await connection.query('INSERT INTO carpetas set ?', [nuevaCarpeta]);

            const descripcion = req.user.Nombre + " creo la carpeta num " + nuevaCarpeta.Num + " para el cliente " + nuevaCarpeta.NombreCliente;
            await guardarEnRegistro(req, descripcion)
            req.flash('succes_msg', 'Carpeta creada');
            
            res.redirect("/ver_carpetas/0");

        }catch(err){
            console.log(err);
            res.send('Error')
        }
    }

    async mostrarCarpetas(req, res){
        try{
            const usuario = CarpetasController.verificarSiHayUsuario(req);
            const carpetas = await CarpetasController.obtenerCarpetas(req);
            let filtro = undefined;

            if(req.params.filtro){
                filtro = req.params.filtro;
            }

            res.render('carpetas/ver_carpetas.ejs', {titulo: 'Inicio', archivo_css: 'carpetas/ver_carpetas', usuario, carpetas, soloMias: req.params.soloMias, filtro})

        }catch(err){
            console.log(err);
            res.send('Error');
        }
    }

    redirigirAVerCarpetas(req, res){

        try{
            const usuario = CarpetasController.verificarSiHayUsuario(req);
            const {Filtro, SoloMias} = req.body;

            res.redirect('ver_carpetas/' + SoloMias + '/' + Filtro);

        }catch(err){
            console.log(err);
            res.send("Error");
        }

    }

    async verCarpeta(req, res){

        const usuario = CarpetasController.verificarSiHayUsuario(req);

        const carpeta = await connection.query('SELECT * FROM carpetas WHERE Id = ?', [req.params.id]);
        const estados = await connection.query('SELECT * FROM estados WHERE CarpetaId = ?', [req.params.id]);
        const clientes = await connection.query('SELECT * FROM usuarios WHERE Rol = 1');

        estados.reverse();

        res.render('carpetas/carpeta.ejs', {titulo: 'Carpeta', archivo_css: 'carpetas/carpeta', usuario, carpeta: carpeta[0], estados, clientes})

    }

    async crearEstado(req, res){
        try{
            const {Titulo, Descripcion} = req.body;

        const nuevoEstado = {
            CarpetaId: req.params.id,
            Titulo,
            Descripcion
        }

        await connection.query('INSERT INTO estados set ?', [nuevoEstado]);

        const descripcion = req.user.Nombre + " actualizo el estado de la carpeta " + req.params.num + " con el titular '" + nuevoEstado.Titulo + "'";
        await guardarEnRegistro(req, descripcion)

        let transporter = nodemailer.createTransport({
            host: "smtp.zoho.com",
            port: 465,
            secure: true, 
            auth: {
              user: '', 
              pass: '', 
            },
          });

        let info = await transporter.sendMail({
            from: '"Actualizacion" <>', 
            to: req.params.mail, 
            subject: "Actualizacion", 
            text: "Se subio una actualizacion de su carpeta \n" + 
                    req.params.etiqueta + "\n" + Titulo + "\n" + Descripcion, 
        });

        req.flash('succes_msg', 'Estado creado');
        res.redirect('/ver_carpeta/' + req.params.id);

        }catch(err){

            console.log(err);
            res.send('Error');
            
        }
    }



    async MisCarpetasCliente(req, res){

        const carpetas = await connection.query('SELECT * FROM carpetas WHERE IdCliente = ?', [req.params.id]);

        if(req.params.id != req.user.Id){
            return res.send('Error');
        }

        const usuario = CarpetasController.verificarSiHayUsuario(req);

        res.render('carpetas/mis_carpetas.ejs', {titulo: 'Carpeta', archivo_css: 'carpetas/mis_carpetas', usuario, carpetas})
    }

    async verMiCarpetaCliente(req, res){

        const carpeta = await connection.query('SELECT * FROM carpetas WHERE Id = ?', [req.params.id]);

        if(carpeta[0].IdCliente != req.user.Id){
            console.log(carpeta[0].IdCliente);
            console.log(req.user.Id);
            return res.send('Error');
        }

        const usuario = CarpetasController.verificarSiHayUsuario(req);
        const estados = await connection.query('SELECT * FROM estados WHERE CarpetaId = ?', [req.params.id]);
        estados.reverse();

        res.render('carpetas/mi_carpeta.ejs', {titulo: 'Carpeta', archivo_css: 'carpetas/mi_carpeta', usuario, num: req.params.num, estados})
    }


    async editarCarpeta(req, res){
        try{
            
            const {Area, Etiqueta, Num, Sector, HBL_HAWB, Cliente, EntidadExterior, Transportista, Origen, Destino, FechaSalida, FechaLlegada} = req.body;

            let arr = Cliente.split("=");
            const IdCliente = arr[0];
            const NombreCliente = arr[1];

            const carpeta = {
                Area,
                Num,
                Etiqueta,
                Sector,
                HBL_HAWB,
                NombreCliente,
                IdCliente,
                EntidadExterior, 
                Transportista, 
                Origen, 
                Destino, 
                FechaSalida,
                FechaLlegada
            }

            await connection.query('UPDATE carpetas set ? WHERE Id = ?', [carpeta, req.params.id]);

            const descripcion = req.user.Nombre + " edito carpeta num: " + Num;
            await guardarEnRegistro(req, descripcion);
            req.flash('succes_msg', 'Carpeta editada');

            res.redirect('/ver_carpeta/' + req.params.id)

        }catch(err){

            console.log(err);
            res.send('Error');

        }
    }


    async eliminarCarpeta(req, res){

        try{

            const c = await connection.query('DELETE FROM carpetas WHERE Id = ?', [req.params.id]);
            const descripcion = req.user.Nombre + " elimino carpeta num: " + req.params.num;
            await guardarEnRegistro(req, descripcion);
            req.flash('succes_msg', 'Carpeta eliminada');
            res.redirect('/ver_carpetas/0');

        }catch(err){

            console.log(err);
            res.send('Error');
            
        }

    }






    /*

        Aca arrancan los metodos estaticos

    */

    static async obtenerCarpetas(req){

        const usuario = CarpetasController.verificarSiHayUsuario(req);
        let carpetas;

        if(req.params.soloMias == 1){
             carpetas = await connection.query('SELECT * FROM carpetas WHERE IdCustomer = ?', [req.user.Id]);
        }else{
             carpetas = await connection.query('SELECT * FROM carpetas');
        }

        if(req.params.filtro){

            const filtro = req.params.filtro.toLowerCase();
            const carpetasFiltradas = [];
            
            if(isNaN(filtro)){

                console.log('es string')
                let nombre;

                carpetas.forEach((carpeta) => {
                    
                    nombre = carpeta.NombreCliente.toLowerCase();
                    if(nombre.includes(filtro)){
                        carpetasFiltradas.push(carpeta);
                    }
                });

                return carpetasFiltradas;

            }else{

                console.log('es numero')
                carpetas.forEach((carpeta) => {
                    if(carpeta.Num.includes(filtro)){
                        carpetasFiltradas.push(carpeta);
                    }
                });

                return carpetasFiltradas;
            }

        }

        return carpetas;

    }

    static verificarSiHayUsuario(req){
        if(req.user){
             return req.user
        }
        return undefined
    }

}

module.exports = CarpetasController;