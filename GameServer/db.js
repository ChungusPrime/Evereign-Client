const mysql = require('mysql2');

class Database {

  constructor () {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'MKB42mp40',
      database: 'evereign'
    }).connect( (error) => {
      if (error) throw error;
      console.log('Database connection established');
    });
  }

  async Query (statement, params) {
    try {
      let result = await this.connection.promise().query(statement);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

}

module.exports = Database;