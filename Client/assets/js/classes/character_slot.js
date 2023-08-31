export default class CharacterSlot extends Phaser.GameObjects.Container {
  
  constructor(sc, x, y, character) {

    super(sc, x, y);

    this.scene = sc;
    this.x = x;
    this.y = y;
    this.character = character;

    this.bg = sc.add.graphics().fillStyle(0x185DE8).fillRoundedRect(0, 0, 100, 100, 8);
    this.sprite = sc.add.sprite(50, 30, 'characters', 0).setOrigin(0.5).setScale(4);
    this.name = sc.add.text(50, 80, character.name, { fontSize: "16px", fill: "#fff" }).setOrigin(0.5);
    this.class = sc.add.text(50, 90, character.class, { fontSize: "16px", fill: "#fff" }).setOrigin(0.5);

    this.add([
      this.bg,
      this.sprite,
      this.name,
      this.class
    ]);

    this.setInteractive();

    this.on('pointerdown', () => {
      return this.character.id;
    });

    this.on('pointerover', () => {
      this.bg.fillStyle(0x57C951, 0.75);
    });
  
    this.on('pointerout', () => {
      this.bg.fillStyle(0x185DE8);
    });

    scene.add.existing(this);
  }
  
}
