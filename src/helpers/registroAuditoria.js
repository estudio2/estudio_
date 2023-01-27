const helpers = {};
const connection = require('../database');

helpers.guardarEnRegistro = async(req, descripcion) => {

        const fecha = new Date();
        const registro = {
            Descripcion: descripcion,
            Dia: fecha.getDate(),
            Mes: fecha.getMonth()+1,
            Anio: fecha.getFullYear(),
            UsuarioNum: req.user.Cuit_Cuil
        }
        console.log(registro);
        await connection.query('INSERT INTO registro_auditoria set ?', [registro]);
        return;
}

module.exports = helpers;