const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (Contrasenia) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Contrasenia, salt);
    return hash;
}

helpers.matchPassword = async function (c1, c2) {
   const resultado = await bcrypt.compare(c1, c2);
   return resultado;
}

module.exports = helpers;