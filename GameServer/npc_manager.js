class NpcManager {

  constructor () {
    this.Npcs = require('../Data/npc_data.js');
    this.Npcs.forEach((npc, i) => {
      npc.target = null;
      npc.startingX = npc.x;
      npc.startingY = npc.y;
      npc.threat = [];
      npc.loot = [];
      npc.distanceToTarget = 0;
    });
  }

  async Get ( id ) {
    return id;
  }

}

module.exports = NpcManager;
