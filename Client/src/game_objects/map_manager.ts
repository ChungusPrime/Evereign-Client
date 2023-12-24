import Game from "../scenes/game";

export default class MapManager {

  scene: Game;
  map: Phaser.Tilemaps.Tilemap;
  tiles1: Phaser.Tilemaps.Tileset;
  tiles2: Phaser.Tilemaps.Tileset;
  tiles3: Phaser.Tilemaps.Tileset;

  Water: Phaser.Tilemaps.TilemapLayer;
  Walls: Phaser.Tilemaps.TilemapLayer;
  Cliffs: Phaser.Tilemaps.TilemapLayer;

  constructor ( scene: Game ) {
    this.scene = scene;
  }

  LoadMap ( name: string ) {

    // Make a tilemap with the given name as the key
    this.map = this.scene.make.tilemap({ key: name });

    // Set the scenes world bounds to width and height of the map
    this.scene.physics.world.bounds.width = this.map.widthInPixels;
    this.scene.physics.world.bounds.height = this.map.heightInPixels;

    // Set the camera bounds to width and height of the map
    this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Load tileset images
    this.tiles1 = this.map.addTilesetImage('Tileset_v1', 'tiles-1', 16, 16);
    this.tiles2 = this.map.addTilesetImage('Tileset_v3_HouseBlocks', 'tiles-2', 16, 16);
    this.tiles3 = this.map.addTilesetImage('Tileset_Indoors_v1', 'tiles-3', 16, 16);

    const AllTileSets = [ 
      this.tiles1,
      this.tiles2,
      this.tiles3
    ];

    this.Water = this.map.createLayer("Water", AllTileSets).setCollisionByExclusion([-1]);
    this.map.createLayer("Ground", AllTileSets);
    this.Walls = this.map.createLayer("Walls", AllTileSets).setCollisionByExclusion([-1]);
    this.map.createLayer("Walls_Passable", AllTileSets);
    this.map.createLayer("Ground_Overlay", AllTileSets);
    this.Cliffs = this.map.createLayer("Cliffs", AllTileSets).setCollisionByExclusion([-1]);

    this.map.objects.forEach(( /*objectsLayers*/ ) => {

      /*if ( objectsLayers.name == "Signs" ) {
        objectsLayers.objects.forEach((sign) => { new Sign(this.scene, sign) });
      }

      if ( objectsLayers.name == "Trees" ) {
        objectsLayers.objects.forEach((tree) => { new Tree(this.scene, tree) });
      }*/
      
    });

    return this.map;

  }

}
