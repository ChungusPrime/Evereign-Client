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
const NPC_1 = require("./NPC");
const node_worker_threads_1 = require("node:worker_threads");
const arcade_physics_1 = require("arcade-physics");
const Quadtree = require("@timohausmann/quadtree-js");
const db_1 = require("./db");
class GameRegion {
    constructor(Name) {
        this.Width = 4800;
        this.Height = 4800;
        this.NPCs = {};
        this.Players = {};
        this.FPS = 15;
        this.Tick = 0;
        console.log(`region ${Name} booting up`);
        this.Name = Name;
        this.Physics = new arcade_physics_1.ArcadePhysics({ width: this.Width, height: this.Height, gravity: { x: 0, y: 0 } });
        this.Quadtree = new Quadtree({ x: 0, y: 0, width: this.Width, height: this.Height });
        this.Create();
    }
    Create() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(this.Name);
            this.DB = new db_1.default();
            yield this.DB.Connect("evereign");
            let [npcs] = yield this.DB.Query("SELECT * FROM data_npcs WHERE area = ?", [this.Name]);
            npcs.forEach((npc) => {
                this.NPCs[npc.id] = new NPC_1.default(npc);
                this.NPCs[npc.id].body = this.Physics.add.body(npc.x, npc.y, npc.width, npc.height);
            });
        });
    }
    Update() {
        let time = this.Tick * 1000;
        let delta = 1000 / this.FPS;
        Region.Physics.world.update(time, delta);
        this.Tick++;
        const player = { x: 475, y: 3043, width: 48, height: 48, faction: "Twilight", socket: "3ycfwda63263qgfed" };
        // NPC Move loop
        for (const key in Region.NPCs) {
            if (Region.NPCs[key].target == null)
                return;
            let npc = Region.NPCs[key];
            Region.Physics.moveTo(npc.body, player.x, player.y, 5);
            npc.x = npc.body.x;
            npc.y = npc.body.y;
            console.log(`moving: ${npc.x}-${npc.y} to ${player.x}, ${player.y}`);
        }
        //console.table(this.NPCs);
        //parentPort.postMessage({ type: "REGION_DATA_TICK", region: this.Name, data: { players: this.Players, npcs: this.NPCs } });
    }
    AddPlayer(message) {
        console.log(message);
        this.Players[message.Character.socket] = message.Character;
        console.log(`Region ${this.Name} adding player`);
    }
    MovePlayer(message) {
        console.log(message);
        const player = this.Players[message.Socket];
        player.x = message.Coordinates.x;
        player.y = message.Coordinates.y;
    }
    RemovePlayer(message) {
        console.log(message);
        const socket = message.Socket;
        delete this.Players[socket];
        node_worker_threads_1.parentPort.postMessage({ type: "PLAYER_REMOVED", region: this.Name, socket: socket });
    }
}
exports.default = GameRegion;
let Region = new GameRegion(node_worker_threads_1.workerData.name);
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
        default: console.log("Invalid action received");
    }
});
setInterval(() => {
    Region.Update();
    // Quadtree testing
    const player = { x: 483, y: 3048, width: 48, height: 48, faction: "Twilight", socket: "3ycfwda63263qgfed" };
    Region.Quadtree.clear();
    for (const key in Region.NPCs) {
        Region.Quadtree.insert(Region.NPCs[key]);
    }
    // Get entities near each player
    Region.Quadtree.retrieve(player).forEach((npc) => {
        if (npc.target != null)
            return;
        if (npc.status != "Alive")
            return;
        if (npc.faction == player.faction)
            return;
        const distance = Math.sqrt(Math.pow((npc.x - player.x), 2) + Math.pow((npc.y - player.y), 2));
        if (distance < 20) {
            npc.target = player.socket;
            console.log("player aggroed", npc);
            node_worker_threads_1.parentPort.postMessage({ type: "PLAYER_AGGRO_ENEMY", region: Region.Name });
        }
    });
    //for ( var i = 0; i < Region.NPCs.length; i++ ) {
    //Physics.moveTo(NPCs[i].body, 100, 100, 50);
    //NPCs[i].x = NPCs[i].body.x;
    //NPCs[i].y = NPCs[i].body.y;
    //NPCs[0].x = Steven.x;
    //NPCs[0].y = Steven.y;
    //myObjects[i].x += myObjects[i].vx;
    //myObjects[i].y += myObjects[i].vy;
    //player.setVelocityX(0);
    //const p = physics.add.staticBody(20, 40, 10, 10);
    //physics.add.collider(player, p);
    //parentPort.postMessage(`You said \"${RegionName}\".`);
    //Region.Quadtree.insert(NPCs[i]);
    //}
}, 1000 / Region.FPS);
