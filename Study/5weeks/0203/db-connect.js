const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "youtube",
  dateStrings: true,
});

connection.query(`SELECT * FROM Users`, function (err, results, fields) {
  var { user_id, email, name, created_at } = results[0];
  console.log(user_id);
  console.log(email);
  console.log(name);
  console.log(created_at);
});

module.exports = connection;
