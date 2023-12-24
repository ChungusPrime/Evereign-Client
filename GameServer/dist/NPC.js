"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NPC {
    constructor(data) {
        this.width = 8;
        this.height = 16;
        this.target = null;
        this.status = "Alive";
        this.moving = false;
        this.body = null;
        Object.assign(this, data);
        this.spawn_x = this.x;
        this.spawn_y = this.y;
        this.current_health = this.max_health;
    }
}
exports.default = NPC;
