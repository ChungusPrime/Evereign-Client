export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor ( scene, player ) {
  
      super ( scene, player.x, player.y, "characters", 0 );
  
      // Player character stats
      this.name = player.name;
      this.class = player.class;
      this.level = player.level;
      this.exp = player.exp;
      // TODO: Calculate exp for next level based on current level and xp
  
      this.currentHealth = player.current_health;
      this.maxHealth = player.max_health;
  
      this.x = player.x;
      this.y = player.y;
  
      this.lastPosition = {
        x: this.x,
        y: this.y
      };
  
      this.strength = player.strength;
      this.intelligence = player.intelligence;
      this.willpower = player.willpower;
      this.agility = player.agility;
      this.endurance = player.endurance;
      this.personality = player.personality;
  
      this.speed = 100 + (player.speed * 5);
  
      this.resource = player.resource;
      this.currentResource = player.current_resource;
      this.maxResource = player.max_resource;
  
      //this.currency = player.currency;
      //this.inventory = player.inventory;
      //this.abilities = player.abilities;
      //this.quickbar = player.quickbar;

      this.setScale(5);
      this.setBodySize(7, 12);
  
      this.setImmovable(false);
      this.setCollideWorldBounds(true);
      scene.physics.world.enable(this);
      scene.cameras.main.startFollow(this);
      this.setActive(true);

      scene.add.existing(this);
    }
  
    update (cursors) {

      this.body.setVelocity(0);

      if(cursors.left.isDown) {
         this.body.setVelocityX(-this.speed);
       } else if(cursors.right.isDown) {
         this.body.setVelocityX(this.speed);
       }
  
       if(cursors.up.isDown) {
         this.body.setVelocityY(-this.speed);
       } else if(cursors.down.isDown) {
         this.body.setVelocityY(this.speed);
       }
    }
  
  }