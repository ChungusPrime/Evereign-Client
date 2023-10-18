const { Worker, isMainThread, parentPort, workerData } = require("node:worker_threads");

console.log("Game server booting...");

const express = require("express");
const app = express();

const server = require("http").Server(app);
const db = require("./database");
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const Port = parseInt(process.argv[2]);

const MaxPlayers = 100;

let Character = require("./Character");
let CharacterManager = require("./character_manager");
let ItemManager = require("./item_manager");
let NPCManager = require("./npc_manager");

let ItemData;
let NPCData;
let GameRegions = {};

(async () => {

  console.log("Initialising game world...");

  CharacterManager = new CharacterManager(db);

  ItemManager = new ItemManager(db);
  ItemData = await ItemManager.GetItemData();

  NPCManager = new NPCManager(db);
  NPCData = await NPCManager.GetNPCData();

  [/*"A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5", 
     "C1", "C2", "C3", "C4", "C5", "D1", "D2", "D3", "D4", "D5",
  */"E1", /*"E2", "E3", "E4", "E5"*/].forEach( ( region ) => {

    GameRegions[region] = { 
      region: region,
      players: {},
      npcs: [],
      nodes: {},
      events: {},
      land: {},
      worker: null
    };
  
    NPCData.forEach( ( npc ) => {
      if ( npc.area == region ) GameRegions[region].npcs.push(npc);
    });
  
    console.table(GameRegions[region].npcs);
  
    const worker = new Worker("./GameRegion.js", { workerData: GameRegions[region] });
  
    worker.on("message", (message) => {
      if ( message.type == "REGION_DATA_TICK" ) {
        GameRegions[message.region] = message.data;
        io.to(message.region).emit('REGION_DATA_TICK', message.data);
      }
    })
    .on("error", (error) => { console.error(error) })
    .on("exit", (code) => { console.log(`Worker exited with code ${code}.`) });

    GameRegions[region].worker = worker;
  });

  server.listen(Port, () => {
    console.log(GameRegions);
    console.log(`Server is running on port ${Port}`);
  });

})();

function SendMessageToWorker ( key, data ) {
  //SendMessageToWorker("F1", { action: "ADD_PLAYER", message: "Hello, connect me to F1 please" } );
  //SendMessageToWorker("F1", { action: "REMOVE_PLAYER", message: "Hello, remove me from F1 please" } );
  GameRegions[key].worker.postMessage(data);
}

setInterval(() => {
  //console.clear();
  //console.table(GameRegions);
}, 1000 / 10);

app.get("/test", async (req, res) => {
  console.log(ItemData, CM, IM);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ CM: CM, IM: IM, ItemData: ItemData });
});

app.post("/status", async (req, res) => {
  console.log(`Getting character list for account ${req.body.id}`);
  res.header("Access-Control-Allow-Origin", "*");
  const characters = await CharacterManager.GetAccountList(req.body.id);
  console.log(characters);
  res.json({
    characters: characters,
    success: true
  });
});

app.post("/create_character", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  const character = CharacterManager.CreateCharacter(req.body.Character, req.body.UserID);
  res.json({ success: true, character: character });
});

// Listen for socket.io connections
io.on( "connection", async ( socket ) => {

  console.log(`socket ${socket.id} requesting to load character ${socket.request._query["character"]}`);

  let Character = await CharacterManager.GetCharacter(socket.request._query["character"]);
  Character.socket = socket.id;
  console.table(Character);

  // Send the new player to relevant region
  SendMessageToWorker(Character.area, { Action: "ADD_PLAYER", Player: Character } );

  // emit the "JoinedGameServer" event to this connected socket, sending the object for the relevant region
  socket.emit("JoinedGameServer", { RegionData: GameRegions[Character.area], Character: Character });

  // Send the new player to every other player in the same area
  io.to(Character.area).emit("PlayerJoined", Character);

  // Newly connected player joins that areas channel
  socket.join(Character.area);

  // when a player moves, update our players array with the new position, then send that position to the other clients
  socket.on("PlayerMoved", async (to) => {
    SendMessageToWorker(Character.area, { Action: "MOVE_PLAYER", Player: to, Socket: socket.id } );
    io.to(Character.area).emit("PlayerMoved", GameRegions[Character.area].players[socket.id].x, GameRegions[Character.area].players[socket.id].y, socket.id);
    console.table(to);
  });

  // when a player disconnects, remove them from our players object and update their pos/area in the db
  socket.on("disconnect", async () => {
    SendMessageToWorker(Character.area, { Action: "REMOVER_PLAYER", Player: Character } );
    //await Character.Update(socket.id);
    io.emit("disconnected", socket.id);
    console.log("player disconnected", socket.id);
  });

});

// Equipment changed
/*socket.on('move-item', async (data) => {

    var player = Players[socket.id];
    var inventory = player.inventory;
    var equipment = player.equipment;

    // prevent item being moved to an occupied slot
    if ( Number.isInteger(data.to) ) {
      var slot = inventory.find(s => s.slot == data.to);
      if ( slot != null ) return;
    } else {
      var slot = equipment.find(s => s.slot == data.to);
      if ( slot != null ) return;
    }

    // Find the item being moved
    if ( Number.isInteger(data.from) ) {
      var index = inventory.findIndex(i => i.id == data.id);
      var item = inventory[index];
    } else {
      var index = equipment.findIndex(i => i.id == data.id);
      var item = equipment[index];
    }

    // Remove it from its current container
    if (Number.isInteger(data.from)) {
      inventory.splice(index, 1);
    } else {
      equipment.splice(index, 1);
    }

    // Add it to the new container
    if (Number.isInteger(data.to)) {
      inventory.push({ id: data.id, item_id: data.item_id, slot: data.to });
    } else {
      equipment.push({ id: data.id, item_id: data.item_id, slot: data.to });
    }

    await characterManager.UpdateCharacter(Players[socket.id]);

    socket.emit('move-item', { id: data.id, item_id: data.item_id, from: data.from, to: data.to });

  });*/

/*socket.on('character-used-ability', async (data) => {
    const player = Players[socket.id];
    const npc = Npc.Npcs.find(n => n.id == data.target);
    const ability = AbilityData.find(a => a.id == data.ability);

    if ( npc.status == "Dead" ) return;

    npc.health -= 1;
    const threat = npc.threat.find(p => p.player == socket.id);
    threat.threat += 10;
    threat.timeout = 30;
    io.to(player.area).emit('npc-damaged', { npc: npc });

    if ( npc.health <= 0 ) {
      npc.threat.forEach((threat, i) => {
        var creditPlayer = Players[threat.player];
        creditPlayer.exp += 10;
        io.to(threat.player).emit("exp-gain", 10);
      });

      // generate loot
      npc.loot.push({
        type: "Currency",
        id: "Gold",
        amount: Math.floor(Math.random() * npc.goldMax) + npc.goldMin
      });

      npc.loot.push({
        type: "Item",
        id: npc.drops[Math.floor(Math.random() * npc.drops.length)]
      });

      npc.status = "Dead";
      npc.target = null;
      npc.threat = [];
      io.to(player.area).emit('npc-died', { id: npc.id, status: "Dead" });
    }

  });*/

/*socket.on('npc-proximity', async (id) => {
    console.log(`${socket.id} aggroed ${id}`);
    const npc = Npc.Npcs.find(n => n.id == id);

    npc.target = socket.id;

    if ( npc.threat.length == 0 ) {
      npc.threat.push({ player: socket.id, threat: 10, timeout: 30 });
      npc.target = socket.id;
    }

    //console.log(npc);
    io.to(npc.area).emit('npc-set-target', npc.id, npc.target);
    io.to(npc.area).emit('npc-move-to', npc.id, npc.target);
  });*/

/*socket.on('npc-moved', async (data) => {
    const npc = Npc.Npcs.find(n => n.id == data.id);
    npc.x = data.x;
    npc.y = data.y;
    npc.distanceToTarget = data.distance;
  });*/

// When a player enters a map transition, get the transition data and update their pos/area
/*socket.on('change-area', async (to) => {
    const player = Players[socket.id];
    player.area = to.area;
    player.x = to.x;
    player.y = to.y;
    socket.emit('load-area', {x: to.x, y: to.y, area: to.area});
  });*/

/*socket.on('npc-interact', async (id) => {
    const npc = Npc.Npcs.find(npc => npc.id == id);
    socket.emit('npc-interact', npc);
  });*/

// NPC Respawning Loop
/*setInterval( () => {
  Npc.Npcs.forEach((npc, index) => {
    if ( npc.status == "Dead" ) npc.currentRespawnTime--;
    if ( npc.currentRespawnTime > 0 ) return;
    console.log(`Spawner ${npc.id} just spawned at ${npc.x}-${npc.y}`);
    npc.status = "Alive";
    npc.loot = [];
    io.to(npc.area).emit('npc-spawned', npc);
    npc.currentRespawnTime = npc.baseRespawnTime;
    npc.health = 10;
  });
}, 1000);*/

// NPC Threat Table Management
/*setInterval(function () {

  Npc.Npcs.forEach((npc, npcIndex) => {

    if ( npc.threat.length == 0 ) return;

    // Continue moving towards current target
    io.to(npc.area).emit('npc-move-to', npc.id, npc.target);

    npc.threat.forEach((threat, i) => {
      threat.timeout--;
      if ( threat.timeout <= 0 ) npc.threat.splice(i, 1);

      if ( npc.threat.length == 0 ) {
        npc.target = null;
        npc.distanceToTarget = 0;
        io.to(npc.area).emit('npc-return', npc.id, npc.target, npc.startingX, npc.startingY);
      } else {
        npc.target = npc.threat[0].player;
        io.to(npc.area).emit('npc-move-to', npc.id, npc.target);
      }

    });

  });

}, 500);*/

/*function angle () {
  var p1 = { x: 20, y: 20 };
  var p2 = { x: 40, y: 40 };
  
  // angle in radians
  var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  
  // angle in degrees
  var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
}

function distance(x1, y1, x2, y2){
  let y = x2 - x1;
  let x = y2 - y1;
  return Math.sqrt(x * x + y * y);
}*/

/*const hrtimeMs = function () {
  let time = process.hrtime()
  return time[0] * 1000 + time[1] / 1000000
}

const TICK_RATE = 10
let tick = 0
let previous = hrtimeMs()
let tickLengthMs = 1000 / TICK_RATE

const loop = () => {
  setTimeout(loop, tickLengthMs)
  let now = hrtimeMs()
  let delta = (now - previous) / 1000
  console.log('delta', delta)
  // game.update(delta, tick) // game logic would go here
  previous = now
  tick++
  console.log('tick', tick)
}*/

//loop() // starts the loop*/
