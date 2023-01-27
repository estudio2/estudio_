const { application } = require('express');
const connection = require('../database');
const nodemailer = require('nodemailer');


class InfoController{

    mostrarInicio(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);
        res.render('info/index.ejs', {titulo: 'JKN Cargo', archivo_css: 'info/index', usuario: usuario, noMostrarVolver: true})
    }

    mostrarPreguntas(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);

        res.render('info/preguntas.ejs', {titulo: 'Preguntas', archivo_css: 'info/preguntas', usuario: usuario})
    }

    mostrarContacto(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);

        res.render('info/contacto.ejs', {titulo: 'Contacto', archivo_css: 'info/contacto', usuario: usuario})
    }

    mostrarFormularioCotizacion(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);

        res.render('info/cotizacion.ejs', {titulo: 'Cotizacion', archivo_css: 'info/cotizacion', usuario: usuario})
    }

    mostrarServicioN(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);
        res.render('info/servicio_n.ejs', {titulo: 'JKN Cargo', archivo_css: 'info/info2', usuario: usuario})
    }

    mostrarServicioI(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);
        res.render('info/servicio_i.ejs', {titulo: 'JKN Cargo', archivo_css: 'info/info', usuario: usuario})
    }

    mostrarServicioD(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);
        res.render('info/servicio_d.ejs', {titulo: 'JKN Cargo', archivo_css: 'info/info', usuario: usuario})
    }

    mostrarServiciosYUtilitarios(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);
        res.render('info/ServiciosyUtilitarios', {titulo: 'JKN Cargo', archivo_css: 'info/info', usuario: usuario})
    }

    mostrarSobreNosotros(req, res){
        const usuario = InfoController.verificarSiHayUsuario(req);
        res.render('info/sobre_nosotros.ejs', {titulo: 'JKN Cargo', archivo_css: 'info/info3', usuario: usuario})
    }

    async enviarConsulta(req, res){
        try{
            const usuario = InfoController.verificarSiHayUsuario(req);

            const {Mail, Nombre, Razon_Social,
                   Tipo_m, Imo, Origen,
                   Destino, Peso, Metros, Contenedor} = req.body;

            const texto = "Pedido de cotizacion: \n Mail: " +
                           Mail + "\n Nombre:" + Nombre + 
                           "\n Razon social: " + Razon_Social + 
                           "\n Mercaderia: " + Tipo_m + 
                           "\n Imo: " + Imo +
                           "\n Origen: " + Origen + "\n Destino: " + 
                           Destino + "\n Peso: " + Peso +
                           "\n Metros cubicos: " + Metros +
                            "\n Contenedor: " + Contenedor;

            console.log(texto);

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
                from: '"Cotizacion" <>', 
                to: "", 
                subject: "Pedido de cotizacion", 
                text: texto, 
            });

            req.flash('succes_msg', 'Pedido de cotizacion enviado');

            res.redirect('/');
        }catch(err){
            console.log(err);
            res.send('error');
        }
    }

    async mostrarRegistroAuditoria(req, res){
        const registros = await connection.query('SELECT * FROM registro_auditoria');
        const usuario = InfoController.verificarSiHayUsuario(req);

        res.render('info/registro_auditoria', {titulo: 'Registro auditoria', archivo_css: 'info/registro_auditoria', usuario: usuario, registros})
    }

    static verificarSiHayUsuario(req){
        if(req.user){
            return req.user
        }
        return undefined
    }

    

}

module.exports = InfoController;