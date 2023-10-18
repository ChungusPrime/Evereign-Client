const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');

const RegionData = workerData;
const RegionName = workerData.region;

//console.log(RegionName);

const { ArcadePhysics } = require('arcade-physics');

const config = {
  width: 4800,
  height: 4800,
  gravity: {
    x: 0,
    y: 0
  }
}

const Physics = new ArcadePhysics(config);

//const player = physics.add.body(20, 20, 4, 8);
//physics.moveTo(player, 100, 100, 100);
//player.setVelocityX(0);
//const platform = physics.add.staticBody(20, 40, 10, 10);
//physics.add.collider(player, platform);

let tick = 0;
const update = () => {
  Physics.world.update(tick * 1000, 1000 / 60);
  Physics.world.postUpdate(tick * 1000, 1000 / 60);
  tick++;
  parentPort.postMessage({ type: "REGION_DATA_TICK", data: RegionData, region: RegionName });
  //console.clear();
  //console.log(tick);
}

setInterval(() => {
  update();
}, 1000 / 60);

parentPort.on("message", (message) => {
  console.table(message);

  if ( message.Action == "MOVE_PLAYER" ) {
    RegionData.players[message.Socket].x = message.Player.x;
    RegionData.players[message.Socket].y = message.Player.y;
  }

  if ( message.Action == "ADD_PLAYER" ) {
    RegionData.players[message.Player.socket] = message.Player;
    console.log(`Region ${RegionName} adding player`);
  }

  if ( message.Action == "REMOVE_PLAYER" ) {
    console.log(`Region ${RegionName} removing player`);
    delete RegionData.players[message.Player.socket];
  }

});

//parentPort.postMessage(`You said \"${RegionName}\".`);