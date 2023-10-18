import Sign from "../classes/sign.js";
import Tree from "../classes/tree.js";

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
    this.map.walls = this.map.createLayer("Walls", AllTileSets).setScale(Scale).setCollisionByExclusion([-1]);
    this.map.createLayer("Walls_Passable", AllTileSets).setScale(Scale);
    this.map.createLayer("Ground_Overlay", AllTileSets).setScale(Scale);
    this.map.cliffs = this.map.createLayer("Cliffs", AllTileSets).setScale(Scale).setCollisionByExclusion([-1]);

    this.map.objects.forEach((objectsLayers) => {

      if ( objectsLayers.name == "Signs" ) {
        objectsLayers.objects.forEach((sign) => { new Sign(this.scene, sign) });
      }

      if ( objectsLayers.name == "Trees" ) {
        objectsLayers.objects.forEach((tree) => { new Tree(this.scene, tree) });
      }
      
    });

    return this.map;

  }

}
