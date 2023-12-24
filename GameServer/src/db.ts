import { Connection } from "mysql2/typings/mysql/lib/Connection";
const mysql = require('mysql2/promise');

export default class Database {
  connection: Connection;
  credentials = {
    host: 'localhost',
    user: 'root',
    password: 'MKB42mp40',
    database: 'evereign'
  };

  async Connect ( database: string ) {
    this.credentials.database = database;
    try {
      this.connection = await mysql.createConnection(this.credentials);
      console.log('database connection established');
    } catch ( error ) {
      console.log('could not connect to database', error);
    }
  }

  async Query (statement: string, params: any): Promise<any> {
    try {
      const Results = await this.connection.execute(statement, params);
      return Results;
    } catch (error) {
      console.log(error);
    }
  }

}