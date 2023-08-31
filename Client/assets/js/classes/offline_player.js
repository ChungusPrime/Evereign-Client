export default class OfflinePlayer extends Phaser.Physics.Arcade.Sprite {
  
  constructor(scene) {

    super(scene, 0, 0, "characters", 0);

    this.x = 322 * 3;
    this.y = 3115 * 3;

    // Player character stats
    this.name = "Chugmus";
    this.class = "Gladiator";
    this.level = 1;
    this.exp = 0;
    this.currentHealth = 10;
    this.maxHealth = 10;

    this.faction = "Kingdom";

    this.strength = 5;
    this.intelligence = 1;
    this.willpower = 2;
    this.agility = 3;
    this.endurance = 5;
    this.personality = 2;

    this.speed = 100;

    this.resource = "Momentum";
    this.currentResource = 0;
    this.maxResource = 100;

    this.currency = [];
    this.inventory = [];
    this.abilities = [];
    this.quickbar = [];
    this.skills = [];

    this.setActive(true);
    //this.setImmovable(false);
    
    scene.physics.world.enable(this);
    scene.cameras.main.startFollow(this);

    this.setScale(5);
    this.setBodySize(8, 12);

    scene.add.existing(this);
    this.setCollideWorldBounds(true);

    return this;
  }

  update(cursors) {

    this.body.setVelocity(0);

    if (cursors.left.isDown) {
      this.body.setVelocityX(-this.speed);
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(this.speed);
    }

    if (cursors.up.isDown) {
      this.body.setVelocityY(-this.speed);
    } else if (cursors.down.isDown) {
      this.body.setVelocityY(this.speed);
    }
    
  }

}
