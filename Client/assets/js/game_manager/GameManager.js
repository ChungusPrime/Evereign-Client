export default class GameManager {

  constructor ( scene ) {
    this.scene = scene;
  }

  LoadMap ( name ) {

    this.currentMap = this.scene.make.tilemap({ key: name });

    //this.tiles = this.currentMap.addTilesetImage('background', 'background', 32, 32, 1, 2);
    //this.ad1 = this.currentMap.addTilesetImage('Tileset_v1', 'admurin1', 16, 16);
    //this.ad2 = this.currentMap.addTilesetImage('buildings', 'admurin2', 16, 16);

    this.tiles = this.currentMap.addTilesetImage('tiles', 'admurin1', 16, 16);
    this.buildings = this.currentMap.addTilesetImage('buildings', 'admurin2', 16, 16);

    this.impassableBackgroundLayer = this.currentMap.createLayer("Impassable_BG", [this.tiles, this.buildings], 0, 0).setScale(2).setCollisionByExclusion([-1]);
    this.groundLayer = this.currentMap.createLayer("Ground", [this.tiles, this.buildings], 0, 0).setScale(2);
    this.impassableLayer = this.currentMap.createLayer("Impassable", [this.tiles, this.buildings], 0, 0).setScale(2).setCollisionByExclusion([-1]);
    this.detailLayer = this.currentMap.createLayer("Detail", [this.tiles, this.buildings], 0, 0).setScale(2);
    this.overlayLayer = this.currentMap.createLayer("Overlay", [this.tiles, this.buildings], 0, 0).setScale(2);

    this.scene.physics.world.bounds.width = this.currentMap.widthInPixels * 2;
    this.scene.physics.world.bounds.height = this.currentMap.heightInPixels * 2;
    this.scene.cameras.main.setBounds(0, 0, this.currentMap.widthInPixels * 2, this.currentMap.heightInPixels * 2);

    this.currentMap.objects.forEach((objectsLayers) => {

      if ( objectsLayers.name == "AreaTransitions" ) {
        objectsLayers.objects.forEach((transition) => {
          var t = this.scene.physics.add.image(transition.x, transition.y, 'items', 3);
          t.area = transition.properties[0].value;
          t.newX = parseInt(transition.properties[1].value);
          t.newY = parseInt(transition.properties[2].value);
          t.setBodySize(240, 60);
          this.scene.areaTransitions.add(t);
        });
      }

    });

  }

}
