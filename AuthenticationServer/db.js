const mysql = require('mysql2/promise');

class Database {

  connection;

  credentials = {
    host: 'localhost',
    user: 'root',
    password: 'MKB42mp40',
    database: ''
  };

  async Connect (database) {

    this.credentials.database = database;

    try {
      this.connection = await mysql.createConnection(this.credentials);
      console.log('database connection established');
    } catch ( error ) {
      console.log('could not connect to database', error);
    }

  }

  async Query (statement, params) {
    try {
      const [Results] = await this.connection.execute(statement, params);
      return Results;
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = Database;