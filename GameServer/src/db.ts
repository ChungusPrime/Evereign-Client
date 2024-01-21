import * as mysql from 'mysql2/promise';

export default class Database {
  
  connection: mysql.Connection;

  credentials = {
    host: 'localhost',
    user: 'root',
    password: 'MKB42mp40',
    database: ''
  };

  constructor ( database: string ) {
    this.credentials.database = database;
  }

  async Connect() {
    try {
      this.connection = await mysql.createConnection(this.credentials);
    } catch (error) {
      console.error('Could not connect to the database', error);
      throw error; // or return a structured error object
    }
  }

  async Query(statement: string, params: any): Promise<any> {
    try {
      const results = await this.connection.execute(statement, params);
      return results;
    } catch (error) {
      console.error('Database query error', error);
      throw error; // or return a structured error object
    }
  }

}