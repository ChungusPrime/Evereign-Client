const express = require('express');
const app = express();
const server = require('http').Server(app);
const db = require('./database');
const cors = require('cors');

const io = require('socket.io')(server, {
  cors: {
      origin: "*",
      methods: ["GET", "POST"]
  }
});

const ListenPort = parseInt(process.argv[2]);

app.options('*', cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const CharacterManager = require('./character_manager');
const ItemManager = require('./item_manager');
//const NpcManager = require('./npc_manager');

const MaxPlayers = 100;
const Players = {};
const Characters = {};

let CM;
let IM;

let ItemData;

(async () => {
  try {

    CM = new CharacterManager(db);
    IM = new ItemManager(db);

    // Retrieve data using the ItemManager and store it in the variable
    ItemData = await IM.GetItemData();

    // Now you can start the server
    server.listen(ListenPort, () => {
      console.log(`Server is running on port ${ListenPort}`);
    });

  } catch (err) {
    console.error('Error retrieving data:', err);
  }
})();

app.get('/test', async (req, res) => {
  console.log(ItemData, CM, IM);
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ CM: CM, IM: IM, ItemData: ItemData });
});

app.post('/status', async (req, res) => {
  console.log(req.body.id);
  res.header("Access-Control-Allow-Origin", "*");
  const characters = CM.GetAccountList(req.body.id);
  res.json({ characters: characters, success: true, players: Object.values(Players).length });
});

app.post('/create_character', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);
  const character = CM.Create(req.body.Character, req.body.UserID);
  res.json({ success: true, character: character });
});



const { ArcadePhysics } = require('arcade-physics');

const config = {
  width: 800,
  height: 450,
  gravity: {
    x: 0,
    y: 0
  }
}

// physics
const physics = new ArcadePhysics(config);

//const player = physics.add.body(20, 20, 4, 8);
//physics.moveTo(player, 100, 100, 100);
//player.setVelocityX(0);
//const platform = physics.add.staticBody(20, 40, 10, 10);
//physics.add.collider(player, platform);

let tick = 0
const update = () => {
  //console.log(player.x, player.y);
  physics.world.update(tick * 1000, 1000 / 60);
  physics.world.postUpdate(tick * 1000, 1000 / 60);
  tick++;
  //console.clear();
}

setInterval(() => {
  update();
}, 1000 / 60);

io.on('connection', async ( socket ) => {

  const character = await CM.Get(socket.request._query['CharacterID'], socket.id);
  Players[socket.id] = character;

  console.log(character);

  socket.emit('connected', Players);
  io.to(character.area).emit('player-connected', character);
  socket.join(character.area);

  // when a player moves, update our players array with the new position, then send that position to the other clients
  socket.on('player-moved', async (to) => {
    const player = Players[socket.id];
    player.x = to.x;
    player.y = to.y;
    socket.broadcast.emit('player-moved', player.x, player.y, player.socket);
  });

  // when a player disconnects, remove them from our players object and update their pos/area in the db
  socket.on('disconnect', async () => {
    console.log("player disconnected", socket.id);
    await Character.Update(Players[socket.id]);
    io.emit('disconnected', socket.id);
    delete Players[socket.id];
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
