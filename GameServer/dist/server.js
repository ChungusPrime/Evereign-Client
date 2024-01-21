"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const db_1 = __importDefault(require("./db"));
const CharacterManager_1 = __importDefault(require("./CharacterManager"));
const express_1 = __importDefault(require("express"));
const http = __importStar(require("http"));
const socketio = __importStar(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)().options("*", (0, cors_1.default)()).use([
    express_1.default.urlencoded({ extended: true }),
    express_1.default.json(),
    express_1.default.static(__dirname)
]);
const Server = http.createServer(app);
const io = new socketio.Server(Server, { cors: { origin: "*", methods: ["GET", "POST"] } });
const ListenPort = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : process.argv[2];
const DatabaseName = (_b = process.env.DATABASE) !== null && _b !== void 0 ? _b : process.argv[3];
const ServerName = (_c = process.env.SERVER) !== null && _c !== void 0 ? _c : process.argv[4];
const DB = new db_1.default(DatabaseName);
const CM = new CharacterManager_1.default(DB);
let PlayerCount = 0;
let GameRegions = {};
app.use('/', (0, routes_1.default)(CM));
/** Boot up the server **/
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield DB.Connect();
        console.log("Main thread connected to Database");
        const Regions = [
            "A1", "A2", "A3", "A4",
            "B1", "B2", "B3", "B4",
            "C1", "C2", "C3", "C4",
            "D1", "D2", "D3", "D4"
        ];
        for (const region of Regions) {
            if (region !== "D1")
                continue;
            GameRegions[region] = {
                name: region,
                Players: {},
                NPCs: {},
                NPCsSyncData: {},
                PlayersSyncData: {},
                Events: {},
                Nodes: {},
                Land: {},
                worker: yield initRegionWorker(region)
            };
        }
        Server.listen(ListenPort, () => {
            console.log(`${ServerName} finished start up and is running on Port ${ListenPort}`);
        });
    }
    catch (error) {
        console.error("Error starting up...", error);
    }
}))();
function initRegionWorker(region) {
    return __awaiter(this, void 0, void 0, function* () {
        const worker = new worker_threads_1.Worker("./GameRegion.js", {
            workerData: { name: region }
        }).on("message", (message) => {
            workerMessageHandlers[message.type](message);
        }).on('error', (error) => {
            console.error(`Worker error in ${region}:`, error);
        }).on('exit', (code) => {
            console.log(`Worker in ${region} exited with code ${code}`);
        });
        return worker;
    });
}
const workerMessageHandlers = {
    REGION_DATA_TICK: SyncRegionData,
    NPC_CHANGED_TARGET: EmitNpcChangedTarget,
    NPC_STARTED_MOVING: EmitNpcStartMove,
    NPC_STOPPED_MOVING: EmitNpcStopMove,
    NPC_RESPAWNED: EmitNpcRespawn,
    NPC_DIED: EmitNpcDied,
    NPC_RESET: EmitNpcReset,
};
function SyncRegionData(message) {
    let region = GameRegions[message.region];
    region.Players = message.Players;
    region.NPCs = message.NPCs;
    for (const key in message.NPCs) {
        region.NPCsSyncData[key] = {
            id: message.NPCs[key].id,
            x: message.NPCs[key].x,
            y: message.NPCs[key].y,
            target: message.NPCs[key].target,
            speed: message.NPCs[key].speed
        };
    }
}
function EmitNpcChangedTarget(message) {
    io.to(message.region).emit("NpcChangedTarget", {
        socket: message.socket,
        npc_id: message.npc_id,
        npc_x: message.npc_x,
        npc_y: message.npc_y
    });
}
function EmitNpcStartMove(message) {
    io.to(message.region).emit("NpcStartMove", {
        npc_id: message.npc_id,
        npc_x: message.npc_x,
        npc_y: message.npc_y,
        npc_speed: message.npc_speed
    });
}
function EmitNpcReset(message) {
    io.to(message.region).emit("NpcReset", {
        npc_id: message.npc_id,
        npc_x: message.npc_x,
        npc_y: message.npc_y
    });
}
function EmitNpcStopMove(message) {
    io.to(message.region).emit("NpcStopMove", {
        npc_id: message.npc_id,
        npc_x: message.npc_x,
        npc_y: message.npc_y
    });
}
function EmitNpcRespawn(message) {
    io.to(message.region).emit("NpcRespawned", message.npc_id, message.npc_x, message.npc_y);
}
function EmitNpcDied(message) {
    io.to(message.region).emit("NpcDied", message.npc_id, message.npc_x, message.npc_y);
}
/** Listen for client socket.io connections **/
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    const CharacterID = socket.handshake.query.CharacterID;
    const AccountID = socket.handshake.query.AccountID;
    const SocketID = socket.id;
    console.log(`connected socketID: ${SocketID} - accountID: ${AccountID} - characterID: ${CharacterID}`);
    if (!CharacterID || !AccountID) {
        //socket.disconnect(true);
    }
    let Character = yield CM.GetCharacter(CharacterID, AccountID, SocketID);
    //console.table(Character, [ "id", "name", "area", "x", "y" ]);
    GameRegions[Character.area].worker.postMessage({ Action: "ADD_PLAYER", Character: Character });
    PlayerCount++;
    socket.emit("ConnectedToGameServer", {
        Character: Character,
        Players: GameRegions[Character.area].PlayersSyncData,
        NPCs: GameRegions[Character.area].NPCsSyncData
    });
    io.to(Character.area).emit("PlayerJoined", Character);
    socket.join(Character.area);
    socket.on("Player-Move", (Coordinates) => __awaiter(void 0, void 0, void 0, function* () {
        GameRegions[Character.area].worker.postMessage({ Action: "MOVE_PLAYER", Coordinates: Coordinates, Socket: socket.id });
        io.to(Character.area).emit("PlayerMoved", { socket: socket.id, x: Coordinates.x, y: Coordinates.y });
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        GameRegions[Character.area].worker.postMessage({ Action: "REMOVE_PLAYER", Socket: socket.id });
        //await CM.UpdateCharacter(Character);
        PlayerCount--;
        io.to(Character.area).emit("PlayerLeft", socket.id);
    }));
}));
app.post("/server_status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header("Access-Control-Allow-Origin", "*");
    res.json({ players: PlayerCount });
}));
