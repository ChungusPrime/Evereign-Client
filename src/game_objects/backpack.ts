import Menu from "../scenes/menu";
import Panel from "./panel";
import ItemData from '../data/ItemData.json';

export default class Backpack extends Phaser.GameObjects.Container {

    scene: Menu;
    x: number;
    y: number;
    Panel: Panel;
    ItemData: any;
  
    constructor ( scene: Menu, x: number, y: number ) {

        super( scene, x, y );

        this.scene = scene;
        this.x = x;
        this.y = y;
        this.Panel = new Panel(scene, "Backpack", 4, 4, this.scene.scale.width * 0.3, this.scene.scale.height * 0.8 );
        this.Panel.Camera.ignore([this.scene.Background, this.scene.ItemBrowserButton, this.scene.OnlineTestButton]);

        this.ItemData = JSON.parse(ItemData);

        let gridx: number = 0;
        let gridy: number = 0;
        let counter: number = 0;
        let containerWidth = this.Panel.width;
        let grid_cell_width = this.Panel.width / 8;

        for ( const key in this.ItemData ) {

            if ( this.ItemData[key].attack_effects != null ) {
                this.ItemData[key].attack_effects = JSON.parse(this.ItemData[key].attack_effects);
            }

            if ( this.ItemData[key].passive_effects != null ) {
                this.ItemData[key].passive_effects = JSON.parse(this.ItemData[key].passive_effects);
            }

            if ( this.ItemData[key].requirements != null ) {
                this.ItemData[key].requirements = JSON.parse(this.ItemData[key].requirements);
            }

            if ( this.ItemData[key].use_effects != null ) {
                this.ItemData[key].use_effects = JSON.parse(this.ItemData[key].use_effects);
            }

            const cell = this.scene.add.image(gridx, gridy, "button4").setOrigin(0);
            cell.setDisplaySize(grid_cell_width, grid_cell_width);

            const sprite = this.scene.add.sprite(gridx, gridy, "weapons", key).setOrigin(0).setInteractive().on('pointerdown', () => {
                console.log(this.ItemData[key]);
            }).setDisplaySize(grid_cell_width, grid_cell_width);

            this.scene.cameras.main.ignore([cell, sprite]);
            this.Panel.ContentContainer.add([cell, sprite]);

            //this.scene.cameras.main.ignore([cell]);
            //this.Panel.ContentContainer.add([cell]);

            gridx += grid_cell_width;
            counter++;
            
            if ( counter == 8 ) {
                counter = 0;
                gridx = 0;
                gridy += grid_cell_width;
            }
        }

        this.Panel.setCameraBoundsHeightGrid(8);

        this.setActive(false);
        this.scene.add.existing(this);
    }
  
}