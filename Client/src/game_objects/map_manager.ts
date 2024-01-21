import Game from "../scenes/game";

export default class MapManager {

  scene: Game;
  map: Phaser.Tilemaps.Tilemap;

  // Tilesets
  Admurin_Outdoor: Phaser.Tilemaps.Tileset;
  Admurin_Outdoor_Recolour: Phaser.Tilemaps.Tileset;
  Admurin_Indoor: Phaser.Tilemaps.Tileset;
  RogueAdventure_Village: Phaser.Tilemaps.Tileset;
  RogueAdventure_Jungle_Extras: Phaser.Tilemaps.Tileset;
  RogueAdventure_Jungle: Phaser.Tilemaps.Tileset;
  RogueAdventure_Ground_Tiles: Phaser.Tilemaps.Tileset;
  RogueAdventure_Wasteland_Water: Phaser.Tilemaps.Tileset;
  RogueAdventure_Interior: Phaser.Tilemaps.Tileset;
  RogueAdventure_Graveyard: Phaser.Tilemaps.Tileset;
  RogueAdventure_tree03_s_01_animation: Phaser.Tilemaps.Tileset;

  // Layers
  Water: Phaser.Tilemaps.TilemapLayer;
  WaterPassable: Phaser.Tilemaps.TilemapLayer;
  Ground: Phaser.Tilemaps.TilemapLayer;
  Walls: Phaser.Tilemaps.TilemapLayer;
  Walls_Passable: Phaser.Tilemaps.TilemapLayer;
  Cliffs: Phaser.Tilemaps.TilemapLayer;
  Ground_Overlay: Phaser.Tilemaps.TilemapLayer;

  constructor ( scene: Game ) {
    this.scene = scene;
  }

  LoadMap ( name: string ) {

    // Make a tilemap with the given name as the key
    this.map = this.scene.make.tilemap({ key: name });
    console.log(this.map.widthInPixels, this.map.heightInPixels);

    // Set the scenes world bounds to width and height of the map
    this.scene.physics.world.bounds.width = this.map.widthInPixels;
    this.scene.physics.world.bounds.height = this.map.heightInPixels;

    // Set the camera bounds to width and height of the map
    this.scene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // Load tileset images
    this.Admurin_Outdoor = this.map.addTilesetImage('Tileset_v1', 'Admurin_Outdoor', 16, 16);
    this.Admurin_Outdoor_Recolour = this.map.addTilesetImage('Tileset_v3_Recolored', 'Admurin_Outdoor_Recolour', 16, 16);
    this.Admurin_Indoor = this.map.addTilesetImage('Tileset_Indoors_v1', 'Admurin_Indoor', 16, 16);
    this.RogueAdventure_Village = this.map.addTilesetImage('RA_Village', 'RogueAdventure_Village', 16, 16);
    this.RogueAdventure_Jungle_Extras = this.map.addTilesetImage('RA_Jungle_Extras', 'RogueAdventure_Jungle_Extras', 16, 16);
    this.RogueAdventure_Jungle = this.map.addTilesetImage('RA_Jungle', 'RogueAdventure_Jungle', 16, 16);
    this.RogueAdventure_Ground_Tiles = this.map.addTilesetImage('RA_Ground_Tiles', 'RogueAdventure_Ground_Tiles', 16, 16);
    this.RogueAdventure_Wasteland_Water = this.map.addTilesetImage('RA_Wasteland_Water', 'RogueAdventure_Wasteland_Water', 16, 16);
    this.RogueAdventure_Interior = this.map.addTilesetImage('RA_Interior', 'RogueAdventure_Interior', 16, 16);
    this.RogueAdventure_Graveyard = this.map.addTilesetImage('RA_Graveyard', 'RogueAdventure_Graveyard', 16, 16);
    this.RogueAdventure_tree03_s_01_animation = this.map.addTilesetImage('tree03_s_01_animation', 'RogueAdventure_tree03_s_01_animation', 16, 16);

    const AllTileSets = [
      this.Admurin_Outdoor,
      this.Admurin_Outdoor_Recolour,
      this.Admurin_Indoor,
      this.RogueAdventure_Village,
      this.RogueAdventure_Jungle_Extras,
      this.RogueAdventure_Jungle,
      this.RogueAdventure_Ground_Tiles,
      this.RogueAdventure_Wasteland_Water,
      this.RogueAdventure_Interior,
      this.RogueAdventure_Graveyard,
      this.RogueAdventure_tree03_s_01_animation
    ];

    // Tiled Layers
    this.Water = this.map.createLayer("Water", AllTileSets).setCollisionByExclusion([-1]);
    this.WaterPassable = this.map.createLayer("Water_Passable", AllTileSets);
    this.Ground = this.map.createLayer("Ground", AllTileSets);
    this.Walls = this.map.createLayer("Walls", AllTileSets).setCollisionByExclusion([-1]);
    this.Walls_Passable = this.map.createLayer("Walls_Passable", AllTileSets);
    this.Cliffs = this.map.createLayer("Cliffs", AllTileSets).setCollisionByExclusion([-1]);
    this.Ground_Overlay = this.map.createLayer("Ground_Overlay", AllTileSets);

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
