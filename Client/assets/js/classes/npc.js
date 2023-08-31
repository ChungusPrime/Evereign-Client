export default class NPC extends Phaser.Physics.Arcade.Sprite {

    constructor ( scene, npc ) {
  
      super ( scene, npc.x, npc.y, "characters", npc.sprite );
  
      // Player character stats
      this.name = npc.name;
      this.title = npc.title;
      this.class = npc.class;

      this.max_health = npc.max_health;
      this.current_health = this.max_health;
      this.armour = 0;
      
      this.x = npc.x * 3;
      this.y = npc.y * 3;
  
      this.speed = 120;

      this.vendor = false;
      this.vendor_items = [];

      this.quest_giver = false;
      this.quests_available = [];

      // Create player's name text
      this.nameText = scene.add.text(this.x, this.y - 50, npc.name, { fontSize: '14px', fill: '#ffffff' }).setOrigin(0.5);
      this.titleText = scene.add.text(this.x, this.y - 40, npc.title, { fontSize: '10px', fill: '#ffffff' }).setOrigin(0.5);

      this.setScale(5);
  
      this.setActive(true);

      scene.add.existing(this);

      this.setInteractive();

      this.on('pointerdown', (pointer) => {
        if (pointer.rightButtonDown()){
          console.log("open context menu", this);
        } else {
          console.log("attempt to attack", this);
        }
      });

    }

    update () {
      this.nameText.setPosition(this.x, this.y - 40);
    }
  
  }