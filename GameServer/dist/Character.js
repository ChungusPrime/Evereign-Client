"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Character {
    constructor(Character, Socket) {
        this.width = 8;
        this.height = 16;
        Object.assign(this, Character);
        this.socket = Socket;
    }
}
exports.default = Character;
