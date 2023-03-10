export default class NpcManager {

  constructor ( scene, socket ) {
    this.scene = scene;
    this.socket = socket;
    this.socket.on('npc-spawned', (npc) => { this.respawnNpc(npc) });
    this.socket.on('npc-move-to', (id, target) => { this.moveNpc(id, target) });
    this.socket.on('npc-set-target', (id, target) => { this.setNpcTarget(id, target) });
    this.socket.on('npc-return', (id, target, x, y) => { this.resetNpcPosition(id, target, x, y) });
    this.socket.on('npc-damaged', (npc) => { console.log(npc) });
    this.socket.on('npc-died', (data) => { this.killNpc(data) });

  }

  setup (npcs) {
    npcs.forEach((npc, i) => { this.createNpc(npc) }, this);
  }

  respawnNpc ( data ) {
    const npc = this.scene.npcs.getChildren().find(n => n.id == data.id);
    npc.status = "Alive";
    npc.setPosition(data.x * 2, data.y * 2);
    npc.setRotation(0)
    npc.clearTint(0);
  }

  createNpc ( npc ) {
    //console.log(npc);
    if ( npc.status == "Dead" ) return;
    const instance = this.scene.physics.add.sprite(npc.x * 2, npc.y * 2, "characters2", npc.sprite).setScale(3.5);
    instance.id = npc.id;
    instance.setBodySize(40, 40);
    instance.setInteractive();
    instance.setRotation(0)
    instance.clearTint();

    instance.on('pointerdown', (pointer) => {
      if ( pointer.leftButtonDown() ) this.scene.targetNPC(npc.id);
      if ( pointer.rightButtonDown() ) this.scene.events.emit('npc-interaction', npc.id);
    });

    instance.on('pointerover', () => { instance.setTint(0x0000ff) });
    instance.on('pointerout', () => { instance.setTint() });
    this.scene.npcs.add(instance);
  }

  killNpc (data) {
    const npc = this.scene.npcs.getChildren().find(n => n.id == data.id);
    npc.status = data.status;
    npc.target = null;
    npc.body.reset(npc.x, npc.y);
    npc.setRotation(90)
    npc.setTint(0x800000);
  }

  // When the player enters the NPCs proximity, we let the server know
  enteredNpcProximity ( player, npc ) {
    if ( npc.target != null || npc.status == "Dead" ) return;
    this.socket.emit('npc-proximity', npc.id);
  }

  // Update the NPCs targeted player
  setNpcTarget (id, target) {
    const npc = this.scene.npcs.getChildren().find(n => n.id == id);
    npc.target = target;
  }

  // Move the NPC to the target with the highest threat in their threat table
  moveNpc (id, target) {
    const npc = this.scene.npcs.getChildren().find(n => n.id == id);
    var player = null;
    if ( target == this.socket.id ) player = this.scene.player;
    else player = this.scene.otherPlayers.getChildren().find(p => p.socket == target);
    this.scene.physics.moveToObject(npc, player, 20);
  }

  // When the NPCs threat table is empty, we return them to their starting X and Y Position
  resetNpcPosition (id, target, x, y) {
    const npc = this.scene.npcs.getChildren().find(n => n.id == id);
    npc.target = target;
    npc.setPosition(x * 2, y * 2);
    npc.body.reset(x * 2, y * 2);
    //this.scene.physics.moveTo(npc, x * 1.5, y * 1.5, 20);
  }

}
