const mysql = require('mysql');
const { promisify } = require('util');

const { database } = require('./keys');

const connection = mysql.createConnection(database);

connection.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Conected to database');
})

connection.query = promisify(connection.query);

module.exports = connection;