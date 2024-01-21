"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NPC {
    constructor(data) {
        this.trainer = false;
        // data set manually
        this.width = 8;
        this.height = 16;
        this.target = null;
        this.status = "Alive";
        this.moving = false;
        this.in_combat = false;
        this.body = null;
        this.baseAggroRange = 50;
        // Time it takes to respawn after death
        this.maxRespawnTime = 10000;
        this.currentRespawnTime = 0;
        // Time it takes to reset after no damage is given or taken
        this.maxResetTime = 6000;
        this.currentResetTime = 0;
        // Time it takes for this npc to attack again
        this.maxAttackTime = 5000;
        this.currentAttackTime = 0;
        Object.assign(this, data);
        this.spawn_x = this.x;
        this.spawn_y = this.y;
        this.current_health = this.max_health;
    }
    UpdatePosition() {
        this.x = this.body.x;
        this.y = this.body.y;
    }
    ChangeTarget(target) {
        this.target = target;
        this.currentResetTime = 0;
        this.in_combat = true;
        console.log(`${this.id} changed target to socket: ${this.target}`);
    }
    TryRespawn(delta) {
        this.currentRespawnTime += delta;
        if (this.currentRespawnTime >= this.maxRespawnTime) {
            this.ResetToDefault();
            return true;
        }
        return false;
    }
    TryReset(delta) {
        this.currentResetTime += delta;
        if (this.currentResetTime >= this.maxResetTime) {
            this.ResetToDefault();
            return true;
        }
        return false;
    }
    ResetToDefault() {
        this.status = "Alive";
        this.currentRespawnTime = 0;
        this.currentResetTime = 0;
        this.moving = false;
        this.current_health = this.max_health;
        this.target = null;
        this.in_combat = false;
        this.body.reset(this.spawn_x, this.spawn_y);
        this.body.x = this.spawn_x;
        this.body.y = this.spawn_y;
        this.UpdatePosition();
    }
    Die() {
        this.status = "Dead";
        this.currentRespawnTime = 0;
        this.currentResetTime = 0;
        this.target = null;
        this.current_health = 0;
        this.moving = false;
        this.in_combat = false;
        this.body.reset(this.body.x, this.body.y);
        this.UpdatePosition();
    }
}
exports.default = NPC;
