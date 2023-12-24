import Menu from '../scenes/menu';

export default class NPC extends Phaser.Physics.Arcade.Sprite {

  starting_x: number;
  starting_y: number;
  title: any;
  class: any;
  faction: any;
  max_health: any;
  current_health: any;
  armour: number;
  respawnTime: number;
  currentRespawnTime: number;
  reset_time: number;
  current_reset_time: number;
  dead: boolean;
  target: null;
  speed: any;
  vendor_items: any;
  vendor: boolean;
  available_quests: any;
  quest_giver: boolean;
  loot_table: any;
  loot: any[];
  name_plate: any;
  health_bar: any;
  attack_bar: any;
  aggro_area: any;
  sprite: string | number;

  constructor( scene: Menu, npc: any ) {

    super( scene, npc.x * 3, npc.y * 3, "characters", npc.sprite );

    this.scene = scene;

    this.starting_x = npc.x * 3;
    this.starting_y = npc.y * 3;
    
    this.name = npc.name;
    this.title = npc.title;
    this.class = npc.class;
    this.faction = npc.faction;

    this.max_health = npc.max_health;
    this.current_health = this.max_health;
    this.armour = 0;

    this.respawnTime = 300;
    this.currentRespawnTime = 0;

    this.reset_time = 240;
    this.current_reset_time = 0;

    this.dead = false;
    this.target = null;

    this.speed = npc.speed;

    this.vendor_items = npc.vendor_items;
    this.vendor = this.vendor_items.length > 0 ? true : false;

    this.available_quests = npc.available_quests;
    this.quest_giver = this.available_quests.length > 0 ? true : false;

    this.loot_table = npc.loot;
    this.loot = [];

    // Create player's name text
    this.name_plate = scene.add.text(this.x, this.y - 65, npc.name, { fontSize: "14px" }).setOrigin(0.5);
    this.health_bar = scene.add.image(this.x, this.y - 55, 'red-bar' ).setDisplaySize(this.name_plate.width, 10).setOrigin(0.5);
    this.attack_bar = scene.add.image(this.x, this.y - 45, 'yellow-bar' ).setDisplaySize(this.name_plate.width, 10).setOrigin(0.5);

    //if ( this.title != "" ) {
    //  this.titleText = scene.add.text(this.x, this.y - 40, npc.title, { fontSize: "14px", fill: "#ffffff" }).setOrigin(0.5);
    //}

    this.setActive(true);

    this.setScale(5);
    //this.setBodySize(8, 12);

    scene.add.existing(this);

    this.aggro_area = scene.add.zone(this.x, this.y, 100 * 2, 100 * 2).setOrigin(0.5);
    scene.physics.world.enable(this.aggro_area);

    this.setInteractive();

    this.on("pointerover", () => {
      /*if ( this.faction == this.scene.player.faction ) {
        this.setTintFill("0x34A623");
      } else {
        this.setTintFill("0xD62E18");
        this.scene.input.setDefaultCursor('url(assets/images/attack_cursor.png), pointer');
      }
      this.scene.events.emit("ShowTooltip", this);*/
    });

    this.on("pointerout", () => {
      this.scene.input.setDefaultCursor('url(assets/images/click_cursor.png), pointer');
      this.clearTint();
      this.scene.events.emit("HideTooltip", this);
    });

    this.on("pointerdown", ( pointer: Phaser.Input.Pointer ) => {

      /*if ( pointer.rightButtonDown() && this.faction == this.scene.player.faction ) {
        console.log("open context menu", this);
      }

      if ( this.faction != this.scene.player.faction && this.scene.player.basicAttackCooldown <= 0 ) {
        let damage = this.scene.player.Attack(this);
        if ( !damage ) return;
        this.current_health -= damage;
        if ( this.target == null ) this.target = this.scene.player;
        if ( this.current_health <= 0 ) this.Die();
        console.log("attacked!");
      } else {
        console.log("cant attack!");
      }*/

    });
  }

  update() {

    if ( this.dead ) {
      this.currentRespawnTime -= 1;
      if ( this.currentRespawnTime <= 0 ) {
        this.Respawn();
      }
      return;
    }

    this.aggro_area.x = this.x;
    this.aggro_area.y = this.y;

    this.name_plate.x = this.x;
    this.name_plate.y = this.y - 65;

    this.health_bar.x = this.x;
    this.health_bar.y = this.y - 55;

    this.attack_bar.x = this.x;
    this.attack_bar.y = this.y - 45;

    if ( this.target == null ) {
      //if ( Phaser.Geom.Rectangle.Overlaps(this.scene.player.getBounds(), this.aggro_area.getBounds()) && this.scene.player.faction != this.faction ) this.target = this.scene.player;
    } else {
      this.scene.physics.moveToObject(this, this.target, 100);
      this.reset_time -= 1;
    }

  }

  AttackTarget () {
    this.current_reset_time = this.reset_time;
  }

  TakeDamage () {
    this.current_reset_time = this.reset_time;
  }

  Die () {
    this.dead = true;
    this.current_health = 0;
    this.target = null;
    this.rotation += 90;
    this.currentRespawnTime = this.respawnTime;
    this.setTintFill(0xD62E18);
    //this.scene.player.exp += 2;
    this.current_reset_time = this.reset_time;
    console.log("npc died");
  }

  Respawn () {
    this.dead = false;
    this.currentRespawnTime = 0;
    this.current_health = this.max_health;
    this.x = this.starting_x;
    this.y = this.starting_y;
    this.aggro_area.x = this.starting_x;
    this.aggro_area.y = this.starting_y;
    this.rotation = 0;
    this.current_reset_time = this.reset_time;
    this.clearTint();
    console.log("npc respawned");
  }

}
