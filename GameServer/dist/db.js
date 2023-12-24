"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require('mysql2/promise');
class Database {
    constructor() {
        this.credentials = {
            host: 'localhost',
            user: 'root',
            password: 'MKB42mp40',
            database: 'evereign'
        };
    }
    Connect(database) {
        return __awaiter(this, void 0, void 0, function* () {
            this.credentials.database = database;
            try {
                this.connection = yield mysql.createConnection(this.credentials);
                console.log('database connection established');
            }
            catch (error) {
                console.log('could not connect to database', error);
            }
        });
    }
    Query(statement, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Results = yield this.connection.execute(statement, params);
                return Results;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = Database;
