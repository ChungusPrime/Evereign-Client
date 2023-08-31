var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MKB42mp40',
  database: 'evereign'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Database connection established');
});

// get the client
/*const mysql = require('mysql2/promise');*/
// create the connection
/*const connection = await mysql.createConnection({host:'localhost', user: 'root', password: 'root', database: 'evereign'});*/

module.exports = connection;
