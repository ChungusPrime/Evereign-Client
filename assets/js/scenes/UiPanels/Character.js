export default class CharacterPanel extends Phaser.GameObjects.Container {

  constructor (scene, player) {

    super(scene, 600, 200);

    this.scene = scene;
    this.x = 600;
    this.y = 200;

    this.setVisible(false);

    this.panelName = "Character";

    this.types = ['head', 'chest', 'legs', 'feet', 'hands', 'necklace', 'ring'];
    this.slots = [];

    this.name = this.scene.add.text(25, 30, player.name, { fontSize: '16px', fill: '#fff' });
    this.class = this.scene.add.text(25, 50, `Level ${player.level} ${player.class}`, { fontSize: '16px', fill: '#fff' });
    this.health = this.scene.add.text(25, 70, `Health: ${player.current_health}/${player.max_health}`, { fontSize: '16px', fill: '#fff' });
    this.armour = this.scene.add.text(25, 90, 'Armour: 0', { fontSize: '16px', fill: '#fff' });
    this.strength = this.scene.add.text(25, 110, `Strength: ${player.strength}`, { fontSize: '16px', fill: '#fff' });
    this.intelligence = this.scene.add.text(25, 130, `Intelligence: ${player.intelligence}`, { fontSize: '16px', fill: '#fff' });
    this.willpower = this.scene.add.text(25, 150, `Willpower: ${player.willpower}`, { fontSize: '16px', fill: '#fff' });
    this.agility = this.scene.add.text(25, 170, `Agility: ${player.agility}`, { fontSize: '16px', fill: '#fff' });
    this.endurance = this.scene.add.text(25, 190, `Endurance: ${player.endurance}`, { fontSize: '16px', fill: '#fff' });
    this.personality = this.scene.add.text(25, 210, `Personality: ${player.personality}`, { fontSize: '16px', fill: '#fff' });
    this.speed = this.scene.add.text(25, 230, `Speed: ${player.speed}`, { fontSize: '16px', fill: '#fff' });

    this.add([
      this.scene.add.sprite(0, 0, `panel-dark`).setOrigin(0).setScale(4, 5),
      this.name,
      this.class,
      this.health,
      this.armour,
      this.strength,
      this.intelligence,
      this.willpower,
      this.agility,
      this.endurance,
      this.personality,
      this.speed
    ]);

    var x = 100;
    var y = 275;

    this.types.forEach((type, i) => {
      var slot = this.scene.add.container(x, y, [
        this.scene.add.sprite(0, 0, `${type}-slot`).setOrigin(0)
      ]).setInteractive(new Phaser.Geom.Rectangle(0, 0, 50, 50), Phaser.Geom.Rectangle.Contains, true);
      slot.slot = type;
      slot.contains = null;
      this.slots.push(slot);
      this.add(slot);

      x += 50;
      if ( i == 3 ) {
        x = 125;
        y = 325;
      }

    }, this);

    this.scene.add.existing(this);
  }

}
