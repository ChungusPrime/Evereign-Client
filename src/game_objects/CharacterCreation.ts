import axios from "axios";
import Menu from "../scenes/menu";
import ModularButton from "./ModularButton";
import ScrollableContentContainer from "./ScrollableContentContainer";

import ClassData from "../data/game_classes.json";
import RaceData from "../data/game_races.json";

export default class CharacterCreation {

    // Setup
    Scene: Menu;
    Width: number;
    Height: number;

    // Panel content
    HTML: Phaser.GameObjects.DOMElement;
    Background: Phaser.GameObjects.Rectangle;
    Container: Phaser.GameObjects.Container;
    Header: Phaser.GameObjects.Text;

    // Characters name
    NameInput: Phaser.GameObjects.Rectangle;
    NamePlaceholder: Phaser.GameObjects.Text;
    NameValue: Phaser.GameObjects.Text;

    ActiveInput: Phaser.GameObjects.Text;

    CreateButton: ModularButton;
    CancelButton: ModularButton;

    InputColour: Number = 0x2E8FA0;
    SelectedInputColour: Number = 0x0D6B7C;

    RaceHeader: Phaser.GameObjects.Text;
    RaceContainer: any;
    RaceOptions: any;

    ClassHeader: Phaser.GameObjects.Text;
    ClassContainer: Phaser.GameObjects.Rectangle;
    ClassOptions: any;
    
    constructor ( Scene: Menu ) {

        this.Scene = Scene;
        this.Width = Scene.scale.width * 0.2;
        this.Height = Scene.scale.height * 0.35;

        this.Scene.input.keyboard.on('keydown', ( event: KeyboardEvent ) => {

            if ( this.Scene.ActivePanel != this ) return;

            // if backspace, remove the last character
            if ( event.key == "Backspace" ) {
                let val = this.ActiveInput.text;
                val = val.slice(0, -1); 
                this.ActiveInput.setText(val);
                return;
            }

            // Only accept letters and numbers
            if ((/^[a-zA-Z0-9]$/.test(event.key))) {
                let val = this.ActiveInput.text + event.key;
                this.ActiveInput.setText(val);
                return;
            }

        });

        this.Container = Scene.add.container(0, 0);

        // #region Race Options
        this.RaceHeader = Scene.add.text(5, 5, "Race", { fontFamily: "Mooli", fontSize: 24 });

        let raceScrollOffset = 0;
        let showNumberRaces = 8;

        this.RaceContainer = Scene.add.rectangle(5, this.RaceHeader.getBottomLeft().y + 5, 275, 275, 0x000000, 0.8)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1)
        .setInteractive()
        .on('wheel', (pointer: any, deltaX: number, deltaY: number, deltaZ: number) => {

            let Counter = 0;
            let yPos = -110;
            let Items = this.RaceOptions.getAll() as any[];

            if ( deltaY > 0 ) {
                if ( raceScrollOffset < Items.length - showNumberRaces ) {
                    raceScrollOffset += 1;
                }
            }

            if ( deltaY < 0 ) {
                if ( raceScrollOffset > 0 ) {
                    raceScrollOffset -= 1;
                }
            }

            Items.forEach( (item: any) => {
                item.setVisible(false);
            });
    
            for ( let i = raceScrollOffset; i < showNumberRaces + raceScrollOffset; i++ ) {
                const element = Items[i];
    
                if ( Counter == 0 )
                    yPos += 0;
                else
                    yPos += element.height + 2;
    
                Items[i].setPosition(2, yPos).setVisible(true);
                Counter++;
            }

        });

        this.RaceOptions = Scene.add.container(this.RaceContainer.getCenter().x, this.RaceContainer.getCenter().y);
        let ogtext = Scene.add.text(this.RaceContainer.getCenter().x, this.RaceContainer.getCenter().y, "X").setVisible(false);

        console.log(JSON.parse(RaceData));

        JSON.parse(RaceData).forEach( (race: any) => {
            let option = this.Scene.add.text(0, 0, race.name, {fontFamily: "Mooli", fontSize: 24})
            .setOrigin(0.5)
            .setVisible(false)
            .setInteractive()
            .on('pointerover', () => {
                option.setTint(0xff0000);
            }).on('pointerout', () => {
                option.clearTint();
            });
            this.RaceOptions.add(option);
        });
        // #endregion Race Options


        // #region Class Options
        this.ClassHeader = Scene.add.text(5, this.RaceContainer.getBottomLeft().y + 10, "Class", { fontFamily: "Mooli", fontSize: 24 });

        let classScrollOffset = 0;
        let showNumberClasses = 8;

        this.ClassContainer = Scene.add.rectangle(5, this.ClassHeader.getBottomLeft().y + 5, 275, 275, 0x000000, 0.8)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1)
        .setInteractive()
        .on('wheel', (pointer: any, deltaX: number, deltaY: number, deltaZ: number) => {

            let Counter = 0;
            let yPos = -110;
            let Items = this.ClassOptions.getAll() as any[];

            if ( deltaY > 0 ) {
                if ( classScrollOffset < Items.length - showNumberClasses ) {
                    classScrollOffset += 1;
                }
            }

            if ( deltaY < 0 ) {
                if ( classScrollOffset > 0 ) {
                    classScrollOffset -= 1;
                }
            }

            Items.forEach( (item: any) => {
                item.setVisible(false);
            });
    
            for ( let i = classScrollOffset; i < showNumberClasses + classScrollOffset; i++ ) {
                const element = Items[i];
    
                if ( Counter == 0 )
                    yPos += 0;
                else
                    yPos += element.height + 2;
    
                Items[i].setPosition(2, yPos).setVisible(true);
                Counter++;
            }

        });

        this.ClassOptions = Scene.add.container(this.ClassContainer.getCenter().x, this.ClassContainer.getCenter().y);
        let ogtext2 = Scene.add.text(this.ClassContainer.getCenter().x, this.ClassContainer.getCenter().y, "X").setVisible(false);

        console.log(JSON.parse(ClassData));

        JSON.parse(ClassData).forEach( (cl: any) => {
            let option = this.Scene.add.text(0, 0, cl.name, {fontFamily: "Mooli", fontSize: 24})
            .setOrigin(0.5)
            .setVisible(false)
            .setInteractive()
            .on('pointerover', () => {
                option.setTint(0xff0000);
            }).on('pointerout', () => {
                option.clearTint();
            });
            this.ClassOptions.add(option);
        });
        // #endregion Class Options


        // #region Attributes
        let AttributesHeader = Scene.add.text(this.RaceHeader.getTopRight().x + 250, 5, "Attributes", { fontFamily: "Mooli", fontSize: 24 });
        let AttributesContainer = Scene.add.rectangle(AttributesHeader.getBottomLeft().x, AttributesHeader.getBottomLeft().y + 5, 275, 550, 0x000000, 0.8)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1);
        // #endregion Attributes

        // #region Information Container
        let InformationHeader = Scene.add.text(Scene.scale.width - 5, 5, "Information", { fontFamily: "Mooli", fontSize: 24 }).setOrigin(1, 0);
        let InformationContainer = Scene.add.rectangle(InformationHeader.getBottomRight().x, InformationHeader.getBottomRight().y + 5, 275, 400, 0x000000, 0.8)
        .setOrigin(1, 0)
        .setStrokeStyle(2, 0xffffff, 1);
        // #endregion Information Container

        // Characters Name Input
        this.NameInput = Scene.add.rectangle(InformationContainer.getBottomLeft().x, InformationContainer.getBottomLeft().y + 5, InformationContainer.width, this.Height * 0.25, 0xffffff, 1)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1)
        .setInteractive()
        .on('pointerdown', () => {
            this.Scene.sound.play('click');
            this.ActiveInput = this.NameValue;
            this.NameInput.setFillStyle(0xd1d1d1, 1);
        });

        const NameInputPosition = this.NameInput.getTopLeft();
        this.NamePlaceholder = Scene.add.text(NameInputPosition.x + 2, NameInputPosition.y + 2, "Character Name", { fontFamily: "Mooli" }).setOrigin(0).setTint(0x000000);

        this.NameValue = Scene.add.text(
            this.NamePlaceholder.getBottomLeft().x + 2,
            this.NamePlaceholder.getBottomLeft().y + 4,
            "",
            {
                fontFamily: "Mooli",
                fontSize: 24,
                fixedWidth: this.NameInput.width - 4,
                wordWrap: { 
                    width: this.NameInput.width - 4,
                    useAdvancedWrap: true
                }
            }

        ).setOrigin(0).setTint(0x000000);

        this.CreateButton = new ModularButton(Scene, this.NameInput.getBottomLeft().x, this.NameInput.getBottomLeft().y + 5, InformationContainer.width, 50, "Grey", "Create", this.CreateCharacter.bind(this), 0);
        this.CancelButton = new ModularButton(Scene, this.NameInput.getBottomLeft().x, this.NameInput.getBottomLeft().y + 60, InformationContainer.width, 50, "Grey", "Cancel", this.CancelCreation.bind(this), 0);

        this.Container.add([
            this.RaceHeader,
            this.RaceContainer,
            this.RaceOptions,
            this.ClassHeader,
            this.ClassContainer,
            this.ClassOptions,
            AttributesHeader,
            AttributesContainer,
            InformationHeader,
            InformationContainer,
            this.CreateButton,
            this.CancelButton,
            this.NameInput,
            this.NamePlaceholder,
            this.NameValue
        ]);

        Scene.add.existing(this.Container);
        this.Container.setVisible(false);
    }

    Show () {
        this.Container.setVisible(true);
        this.ActiveInput = null;
    }

    Hide () {
        this.Container.setVisible(false);
        this.ActiveInput = null;
    }

    async CreateCharacter () {
        const Result = await axios.post<{ message: string }>(`${this.Scene.DataServerAddress}/create_character`, { 
          Character: null,
          UserID: this.Scene.AccountID
        });
        console.log(Result);
    }

    async CancelCreation () {
        console.log("fucking cancel");
    }
    
  
}
