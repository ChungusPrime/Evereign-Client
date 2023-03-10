export default class AbilityPanel extends Phaser.GameObjects.Container {

  constructor (scene, abilities) {
    super(scene, 800, 200);
    this.scene = scene;
    this.x = 800;
    this.y = 200;

    this.add( this.scene.add.sprite(0, 0, `panel-dark`).setOrigin(0).setScale(4, 5) );
    this.add( this.scene.add.text(25, 30, 'Abilities', { fontSize: '16px', fill: '#fff' }) );

    this.setVisible(false);
    this.panelName = "Abilities";
    this.scene.add.existing(this);

    console.log(abilities);

    abilities.forEach((ability, i) => {

      var data = this.scene.abilityData.find(a => a.id == ability.ability_id);

      console.log(data);

      var container = this.scene.add.container(25, 50, [
        this.scene.add.sprite(0, 0, 'button4').setOrigin(0).setScale(1.5),
        this.scene.add.text(75, 0, data.name, { fontSize: '24px', fill: '#fff' }),
        this.scene.add.text(75, 30, data.description, {
          fontSize: '16px', fill: '#fff',
          wordWrap: { width: 300 }
        })
      ]);

      var sprite = this.scene.add.sprite(2, 2, 'skills_b', data.sprite).setScale(2).setOrigin(0).setInteractive();

      sprite.is = "ability";

      sprite.on('pointerover', () => {
        sprite.setTint(0x00ff00);
      });

      sprite.on('pointerout', () => { sprite.clearTint() });

      this.scene.input.setDraggable(sprite);

      container.add(sprite);

      this.add(container);
    });

  }

}
