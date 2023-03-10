const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const db = require('./database');
const authRoutes = require('./routes');

const ItemManager = require('./item_manager');
const CharacterManager = require('./character_manager');

const AbilityData = require('./ability_data');
const ItemData = require('./item_data.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));
app.use("/auth", authRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const itemManager = new ItemManager(ItemData);
const characterManager = new CharacterManager(db, AbilityData, ItemData);

const Players = {};

var NPCs = require('./npc_data.js');
NPCs.forEach((npc, i) => {
  npc.target = null;
  npc.startingX = npc.x;
  npc.startingY = npc.y;
  npc.threat = [];
  npc.loot = [];
  npc.distanceToTarget = 0;
});

// NPC Respawning Loop
setInterval(function () {
  NPCs.forEach((npc, index) => {
    if ( npc.status == "Dead" ) npc.currentRespawnTime--;
    if ( npc.currentRespawnTime > 0 ) return;
    console.log(`Spawner ${npc.id} just spawned at ${npc.x}-${npc.y}`);
    npc.status = "Alive";
    npc.loot = [];
    io.to(npc.area).emit('npc-spawned', npc);
    npc.currentRespawnTime = npc.baseRespawnTime;
    npc.health = 10;
  });
}, 1000);

// NPC Threat Table Management
setInterval(function () {

  NPCs.forEach((npc, npcIndex) => {

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

}, 500);


setInterval(function () {
  /*Object.keys(Players).forEach((player, i) => {
    var p = Players[player];
    console.log("Inventory", p.inventory);
    console.log("Equipment", p.equipment);
  });*/
}, 50);


io.on('connection', async (socket) => {

  const character = await characterManager.GetCharacter(socket.request._query['character'], socket.id);
  Players[socket.id] = character;
  console.log(character);
  //console.log(character.inventory);

  socket.emit('game-state', Players, NPCs);
  io.to(character.area).emit('player-connected', character);
  socket.join(character.area);

  // when a player moves, update our players array with the new position, then send that position to the other clients
  socket.on('player-moved', async (movedTo) => {
    const player = Players[socket.id];
    player.x = movedTo.x;
    player.y = movedTo.y;
    socket.broadcast.emit('player-moved', player.x, player.y, player.socket);
  });

  // Equipment changed
  socket.on('move-item', async (data) => {

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

  });

  socket.on('character-used-ability', async (data) => {
    const player = Players[socket.id];
    const npc = NPCs.find(n => n.id == data.target);
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

  });

  socket.on('npc-proximity', async (id) => {
    console.log(`${socket.id} aggroed ${id}`);
    const npc = NPCs.find(n => n.id == id);

    npc.target = socket.id;

    if ( npc.threat.length == 0 ) {
      npc.threat.push({ player: socket.id, threat: 10, timeout: 30 });
      npc.target = socket.id;
    }

    //console.log(npc);
    io.to(npc.area).emit('npc-set-target', npc.id, npc.target);
    io.to(npc.area).emit('npc-move-to', npc.id, npc.target);
  });

  socket.on('npc-moved', async (data) => {
    const npc = NPCs.find(n => n.id == data.id);
    npc.x = data.x;
    npc.y = data.y;
    npc.distanceToTarget = data.distance;
  });

  // When a player enters a map transition, get the transition data and update their pos/area
  socket.on('change-area', async (to) => {
    const player = Players[socket.id];
    player.area = to.area;
    player.x = to.x;
    player.y = to.y;
    socket.emit('load-area', {x: to.x, y: to.y, area: to.area});
  });

  // when a player disconnects, remove them from our players object and update their pos/area in the db
  socket.on('disconnect', async () => {

    console.log("player disconnected", socket.id);
    const player = Players[socket.id];
    db.query(`UPDATE characters SET x = ?, y = ?, area = ? WHERE id = ?`, [ player.x, player.y, player.area, player.id ], function (error, result) {
      if ( error ) throw error;
      io.emit('disconnected', socket.id);
      delete Players[socket.id];

      NPCs.forEach((npc, npcIndex) => {
        if ( npc.threat.length == 0 ) return;
        npc.threat.forEach((threat, i) => {
          if ( threat.player == socket.id ) npc.threat.splice(i, 1);
        });
      });

    });

  });

  socket.on('npc-interact', async (id) => {
    const npc = NPCs.find(npc => npc.id == id);
    socket.emit('npc-interact', npc);
  });

});

server.listen(8082, () => {
  console.log(`Listening on port ${server.address().port}`);
});
