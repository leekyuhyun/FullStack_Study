const mysqldb = require('mysql2');

const conn = mysqldb.createConnection(
    {
        host: 'localhost',
        port: 3306,
        user: 'user',
        password: '1234',
        database: 'kyulee',
    }
);

module.exports = conn;