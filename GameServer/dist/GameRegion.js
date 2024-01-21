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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NPC_1 = __importDefault(require("./NPC"));
const node_worker_threads_1 = require("node:worker_threads");
const arcade_physics_1 = require("arcade-physics");
const quadtree_js_1 = __importDefault(require("@timohausmann/quadtree-js"));
const db_1 = __importDefault(require("./db"));
class GameRegion {
    constructor(Name) {
        this.Width = 4800;
        this.Height = 4800;
        this.NPCs = {};
        this.Players = {};
        this.Events = {};
        this.Nodes = {};
        this.Land = {};
        this.FPS = 15;
        this.Tick = 0;
        this.Name = Name;
        this.Create();
        console.log(`${this.Name} set up`);
    }
    Create() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Physics = new arcade_physics_1.ArcadePhysics({ width: this.Width, height: this.Height, gravity: { x: 0, y: 0 } });
            this.Quadtree = new quadtree_js_1.default({ x: 0, y: 0, width: this.Width, height: this.Height });
            this.DB = new db_1.default("evereign");
            yield this.DB.Connect();
            let [npcs] = yield this.DB.Query("SELECT * FROM data_npcs WHERE region = ?", [this.Name]);
            npcs.forEach((npc) => {
                this.NPCs[npc.id] = new NPC_1.default(npc);
                this.NPCs[npc.id].body = this.Physics.add.body(npc.x, npc.y, npc.width, npc.height);
            });
        });
    }
    AddPlayer(message) {
        console.log(`Region: ${this.Name} adding player ${message.Character.socket}`);
        this.Players[message.Character.socket] = message.Character;
    }
    RemovePlayer(message) {
        delete this.Players[message.Socket];
        console.log(`Region: ${this.Name} removing player ${message.Socket}`);
        for (const key in this.NPCs) {
            if (this.NPCs[key].target == message.Socket) {
                this.NPCs[key].target = null;
                this.NPCs[key].moving = false;
                this.NPCs[key].body.reset(this.NPCs[key].body.x, this.NPCs[key].body.y);
                this.NPCs[key].UpdatePosition();
                continue;
            }
        }
    }
    MovePlayer(message) {
        this.Players[message.Socket].x = message.Coordinates.x;
        this.Players[message.Socket].y = message.Coordinates.y;
    }
    Update() {
        let time = this.Tick * 1000;
        let delta = 1000 / this.FPS;
        this.Physics.world.update(time, delta);
        this.Tick++;
        // NPC update loop
        for (const key in this.NPCs) {
            //if ( this.NPCs[key].id != 24 ) continue;
            let npc = this.NPCs[key];
            // if the npc is dead -> Update respawn timer 
            if (npc.status == "Dead") {
                if (npc.TryRespawn(delta)) {
                    node_worker_threads_1.parentPort.postMessage({ type: "NPC_RESPAWNED", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
                    continue;
                }
            }
            // If npcs health is reduced to 0 or less -> kill them
            if (npc.current_health <= 0) {
                npc.Die();
                node_worker_threads_1.parentPort.postMessage({ type: "NPC_DIED", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
                continue;
            }
            // In combat with target
            if (!npc.in_combat)
                continue;
            if (npc.target != null) {
                const player = this.Players[npc.target];
                const dist = Math.sqrt(Math.pow((npc.x - player.x), 2) + Math.pow((npc.y - player.y), 2));
                if (dist > 18) {
                    this.Physics.moveTo(npc.body, player.x, player.y, npc.speed);
                    npc.UpdatePosition();
                    if (!npc.moving) {
                        npc.moving = true;
                        node_worker_threads_1.parentPort.postMessage({ type: "NPC_STARTED_MOVING", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y, npc_speed: npc.speed });
                    }
                    if (npc.TryReset(delta)) {
                        node_worker_threads_1.parentPort.postMessage({ type: "NPC_RESET", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
                    }
                }
                else {
                    npc.body.reset(npc.body.x, npc.body.y);
                    npc.UpdatePosition();
                    npc.currentResetTime = 0;
                    if (npc.moving) {
                        npc.moving = false;
                        node_worker_threads_1.parentPort.postMessage({ type: "NPC_STOPPED_MOVING", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
                    }
                }
            }
            else {
                if (npc.TryReset(delta)) {
                    node_worker_threads_1.parentPort.postMessage({ type: "NPC_RESET", region: this.Name, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
                }
            }
            console.log(`NPC: ${npc.id}, X:${Math.round(npc.x)} Y:${Math.round(npc.y)}) combat: ${npc.in_combat} target: ${npc.target} moving: ${npc.moving} reset: ${Math.round(npc.currentResetTime)}/${npc.maxResetTime}`);
        }
        // Refresh Quadtree
        this.Quadtree.clear();
        for (const key in this.NPCs) {
            this.Quadtree.insert(this.NPCs[key]);
        }
        for (const key in this.Players) {
            let player = this.Players[key];
            this.Quadtree.retrieve(player).forEach((npc) => {
                if (npc.target != null || npc.status != "Alive" || npc.faction == player.faction)
                    return;
                if (Math.sqrt(Math.pow((npc.x - player.x), 2) + Math.pow((npc.y - player.y), 2)) <= npc.baseAggroRange) {
                    npc.ChangeTarget(player.socket);
                    node_worker_threads_1.parentPort.postMessage({ type: "NPC_CHANGED_TARGET", region: Region.Name, socket: npc.target, npc_id: npc.id, npc_x: npc.x, npc_y: npc.y });
                }
            });
        }
        // update main thread
        node_worker_threads_1.parentPort.postMessage({ type: "REGION_DATA_TICK", region: this.Name, Players: this.Players, NPCs: this.NPCs });
    }
}
exports.default = GameRegion;
// Incoming messages from the parent thread
node_worker_threads_1.parentPort.on("message", (message) => {
    switch (message.Action) {
        case "ADD_PLAYER":
            Region.AddPlayer(message);
            break;
        case "MOVE_PLAYER":
            Region.MovePlayer(message);
            break;
        case "REMOVE_PLAYER":
            Region.RemovePlayer(message);
            break;
        default:
            console.log("Invalid action received");
            break;
    }
});
const Region = new GameRegion(node_worker_threads_1.workerData.name);
setInterval(() => {
    Region.Update();
}, 1000 / Region.FPS);
