import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  
  constructor( scene, player, socket = null ) {

    super( scene, player.x * 3, player.y * 3, "characters", 0 );

    this.scene = scene;
    this.socket = socket;

    // Player character stats
    this.name = player.name;
    this.class = player.class;

    this.speed = 125;

    /*this.subclass = player.subclass;
    this.level = player.level;
    this.exp = player.exp;
    this.currentHealth = player.health;
    this.maxHealth = player.health;*/

    this.last_pos = {
      x: this.x,
      y: this.y,
    };

    /*this.faction = player.faction;

    this.strength = player.strength;
    this.intelligence = player.intelligence;
    this.willpower = player.willpower;
    this.agility = player.agility;
    this.endurance = player.endurance;
    this.personality = player.personality;

    this.speed = player.speed;

    this.resource = player.resource;
    this.currentResource = player.currentResource;
    this.maxResource = player.maxResource;

    // Equipment
    this.mainhand = null;
    this.offhand = null;
    this.head = null;
    this.chest = null;
    this.legs = null;
    this.feet = null;
    this.ring = null;
    this.necklace = null;
    this.ammo = null;
    this.classitem = null;

    this.basicAttackCooldown = 0;
    this.basicAttackCooldownMax = 180;

    this.currency = [];
    this.inventory = [];
    this.abilities = [];
    this.skills = [];
    this.quickbar = [];*/

    scene.add.existing(this);

    this.setActive(true);
    
    scene.physics.world.enable(this);
    scene.cameras.main.startFollow(this);

    this.setScale(5);
    this.setBodySize(8, 12);

    this.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.one = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.two = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.three = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.four = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.five = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);

    this.setInteractive();

    this.on('pointerdown', () => {
      console.log(this);
    });

    //this.setDepth(999);

    return this;
  }

  update () {

    this.body.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
      //this.flipX();
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
      //this.flipX();
    }

    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
    }

    if(Phaser.Input.Keyboard.JustDown(this.one)) this.UseQuickbarSlot(1);
    if(Phaser.Input.Keyboard.JustDown(this.two)) this.UseQuickbarSlot(2);
    if(Phaser.Input.Keyboard.JustDown(this.three)) this.UseQuickbarSlot(3);
    if(Phaser.Input.Keyboard.JustDown(this.four)) this.UseQuickbarSlot(4);
    if(Phaser.Input.Keyboard.JustDown(this.five)) this.UseQuickbarSlot(5);
  
    //if ( this.basicAttackCooldown > 0 ) this.basicAttackCooldown -= 1;
    //if ( this.basicAttackCooldown < 0 ) this.basicAttackCooldown = 0;

    if ( this.socket != null ) {
      if ( this.x !== this.last_pos.x || this.y !== this.last_pos.y ) {
        this.scene.socket.emit('PlayerMoved', { x: this.x, y: this.y });
      }
    }

    this.last_pos = { x: this.x, y: this.y };
  }

  UseQuickbarSlot ( index ) {
    console.log(`Using ability or item in quickslot index: ${index}`);
    this.scene.cameras.main.shake(100, 0.01);
    //this.cameras.main.fadeIn(500, 0, 0, 0);
    //this.cameras.main.fadeOut(500, 0, 0, 0);
  }

  Attack ( target ) {

    /*if ( this.mainhand == null ) {
      return false;
    }

    console.log(target);

    let damage = 1;

    this.basicAttackCooldown = this.basicAttackCooldownMax;

    return damage;*/
  }

  AddExp ( amount ) {

  }

  AddHealth () {

  }

  RemoveHealth () {

  }

}
