export default class MapManager {

  constructor ( scene ) {
    this.scene = scene;
  }

  LoadMap ( name ) {

    // Set map scale
    const Scale = 3;

    // Make a tilemap with the given name as the key
    this.map = this.scene.make.tilemap({ key: name });

    // Set the scenes world bounds to width and height of the map
    this.scene.physics.world.bounds.width = this.map.widthInPixels * Scale;
    this.scene.physics.world.bounds.height = this.map.heightInPixels * Scale;

    // Set the camera bounds to width and height of the map
    this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels * Scale, this.map.heightInPixels * Scale);

    // Load tileset images
    this.tiles_1 = this.map.addTilesetImage('Tileset_v1', 'tiles-1', 16, 16);
    this.tiles_2 = this.map.addTilesetImage('Tileset_v3_HouseBlocks', 'tiles-2', 16, 16);
    this.tiles_3 = this.map.addTilesetImage('Tileset_Indoors_v1', 'tiles-3', 16, 16);

    const AllTileSets = [ this.tiles_1, this.tiles_2, this.tiles_3 ];

    this.map.water = this.map.createLayer("Water", AllTileSets).setScale(Scale).setCollisionByExclusion([-1]);
    this.map.createLayer("Ground", AllTileSets).setScale(Scale);
    this.map.createLayer("InvisibleWall", AllTileSets).setScale(Scale);
    this.map.createLayer("Trees", AllTileSets).setScale(Scale);
    this.map.createLayer("Port", AllTileSets).setScale(Scale);
    this.map.createLayer("Ground_Overlay", AllTileSets).setScale(Scale);

    return this.map;

    /*this.currentMap.objects.forEach((objectsLayers) => {

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

    });*/

  }

}
