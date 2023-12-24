"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Character {
    constructor(id, x, y, name, base_class, faction, race, socket, area) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.base_class = base_class;
        this.faction = faction;
        this.race = race;
        this.socket = socket;
        this.area = area;
    }
}
exports.default = Character;
