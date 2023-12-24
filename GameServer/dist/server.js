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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const db_1 = require("./db");
const CharacterManager_1 = require("./CharacterManager");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require('path');
const util = require('node:util');
const cors = require("cors");
const app = express().options("*", cors()).use([
    express.urlencoded({ extended: true }),
    express.json(),
    express.static(__dirname)
]);
const server = http.createServer(app);
const io = new socketio.Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
let ListenPort = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : process.argv[2];
let DatabaseName = (_b = process.env.DATABASE) !== null && _b !== void 0 ? _b : process.argv[3];
let ServerName = (_c = process.env.SERVER) !== null && _c !== void 0 ? _c : process.argv[4];
// Data
let DB = new db_1.default();
let CM = new CharacterManager_1.default(DB);
let GameRegions = {};
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Server Start Up
    try {
        yield DB.Connect(DatabaseName);
        yield SetupRegions();
        server.listen(ListenPort, () => {
            console.log(`${ServerName} finished start up and is running on Port ${ListenPort}`);
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
function SetupRegions() {
    return __awaiter(this, void 0, void 0, function* () {
        // Set up a worker for each region of the game world
        const Regions = [
            "A1", "A2", "A3", "A4",
            "B1", "B2", "B3", "B4",
            "C1", "C2", "C3", "C4",
            "D1", "D2", "D3", "D4",
            "E1", "E2", "E3", "E4"
        ];
        Regions.forEach((region) => {
            // Only use E1 for now
            if (region != "E1")
                return;
            GameRegions[region] = { name: region, players: {}, npcs: {}, worker: null };
            let worker = new worker_threads_1.Worker("./GameRegion.js", {
                workerData: GameRegions[region]
            }).on("message", (message) => {
                ProcessWorkerMessage(message);
            }).on("error", (error) => {
                console.error(error);
            }).on("exit", (code) => {
                console.log(`Worker exited with code ${code}.`);
            });
            GameRegions[region].worker = worker;
        });
        return true;
    });
}
const ProcessWorkerMessage = (message) => {
    // Sync region data
    if (message.type == "REGION_DATA_TICK") {
        GameRegions[message.region].players = message.data.players;
        GameRegions[message.region].npcs = message.data.players;
        console.log(GameRegions[message.region]);
    }
    if (message.type == "PLAYER_REMOVED") {
        io.to(message.region).emit('PLAYER_REMOVED', {});
    }
};
// Listen for socket.io connections
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`socket ${socket.id} requesting to load character ${socket.handshake.query.CharacterID}`);
    // Get the requested character
    let CharacterID = socket.handshake.query.CharacterID;
    let Character = yield CM.GetCharacter(CharacterID, socket.id);
    // Add the new character to the region worker
    GameRegions[Character.area].worker.postMessage({ Action: "ADD_PLAYER", Character: Character });
    // Send the character and region data to the requesting client
    socket.emit("ConnectedToGameServer", {
        Character: Character,
        Players: GameRegions[Character.area].players,
        NPCs: GameRegions[Character.area].npcs
    });
    // Send the character to currently connected clients in the same area
    io.to(Character.area).emit("PlayerJoined", Character);
    // Join this socket to the area
    socket.join(Character.area);
    socket.on("Player-Move", (Coordinates) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(Coordinates);
        GameRegions[Character.area].worker.postMessage({ Action: "MOVE_PLAYER", Coordinates: Coordinates, Socket: socket.id });
        io.to(Character.area).emit("PlayerMoved", Coordinates.x, Coordinates.y, socket.id);
    }));
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        GameRegions[Character.area].worker.postMessage({ Action: "REMOVE_PLAYER", Character: Character });
        yield CM.Update(Character);
        io.to(Character.area).emit("disconnected", socket.id);
        console.log("player disconnected", socket.id);
    }));
}));
app.get("/dev/monitor", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header("Access-Control-Allow-Origin", "*");
    res.sendFile(path.join(__dirname, '/monitor.html'));
}));
app.post("/dev/monitor/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header("Access-Control-Allow-Origin", "*");
    console.log("get fresh data");
    res.json({ RegionData: {} });
}));
app.post("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Getting character list for account ${req.body.id}`);
    res.header("Access-Control-Allow-Origin", "*");
    const characters = yield CM.GetAccountList(req.body.id);
    console.log(characters);
    res.json({
        characters: characters !== null && characters !== void 0 ? characters : null,
        success: true
    });
}));
app.post("/create_character", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(req.body);
    const character = CM.CreateCharacter(req.body.Character, req.body.UserID);
    res.json({ success: true, character: character });
}));
