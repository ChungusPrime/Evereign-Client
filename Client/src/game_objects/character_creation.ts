import axios from "axios";
import Menu from "../scenes/menu";
import Button from "./button";

export default class CharacterCreation extends Phaser.GameObjects.Container {

  scene: Menu;
  step: number;

  RemainingAttributePoints: number;
  AttributePointsRemainingText: Phaser.GameObjects.Text;

  character: any;

  ClassSelectionScreen: Phaser.GameObjects.Container;
  ClassScreenHeader: Phaser.GameObjects.Text;
  ClassOptionsList: Phaser.GameObjects.Rectangle;
  ClassDescription: Phaser.GameObjects.Rectangle;
  ClassDescriptionText: Phaser.GameObjects.Text;
  
  RaceSelectionScreen: Phaser.GameObjects.Container;
  RaceScreenHeader: Phaser.GameObjects.Text;
  RaceOptionsList: Phaser.GameObjects.Rectangle;
  RaceDescription: Phaser.GameObjects.Rectangle;
  RaceDescriptionText: Phaser.GameObjects.Text;

  FactionSelectionScreen: Phaser.GameObjects.Container;
  FactionScreenHeader: Phaser.GameObjects.Text;
  FactionOptionsList: Phaser.GameObjects.Rectangle;
  FactionDescription: Phaser.GameObjects.Rectangle;
  FactionDescriptionText: Phaser.GameObjects.Text;

  AttributeAssignmentScreen: Phaser.GameObjects.Container;

  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, x, y );

    this.character = {
      name: "",
      class: "",
      faction: "",
      race: "",
      strength: null,
      intelligence: null,
      willpower: null,
      agility: null,
      endurance: null,
      personality: null
    }
    
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.step = 1;
    this.RemainingAttributePoints = 6;

    // Create Class Selection Screen;
    this.ClassScreenHeader = this.scene.add.text(0, 5, "Choose Class", { align: "center", fontSize: 36, fontFamily: "Mooli" }).setOrigin(0);
    this.ClassOptionsList = this.scene.add.rectangle(0, 0, 600, 800, 0x000000, 0.8).setOrigin(0);
    this.ClassDescription = this.scene.add.rectangle(610, 0, 600, 800, 0x000000, 0.8).setOrigin(0);
    this.ClassDescriptionText = this.scene.add.text(615, 5, "", { align: "left", fontSize: 13, fontFamily: "Mooli", wordWrap: { width: 595, useAdvancedWrap: true } }).setOrigin(0);
    this.ClassSelectionScreen = scene.add.container(0, 0).add([ 
      this.ClassOptionsList, this.ClassDescription, this.ClassScreenHeader, this.ClassDescriptionText
    ]).setVisible(true);

    // Create Race Selection Screen;
    this.RaceScreenHeader = this.scene.add.text(0, 5, "Choose Race", { align: "center", fontSize: 36, fontFamily: "Mooli" }).setOrigin(0);
    this.RaceOptionsList = this.scene.add.rectangle(0, 0, 600, 800, 0x000000, 0.8).setOrigin(0);
    this.RaceDescription = this.scene.add.rectangle(610, 0, 600, 800, 0x000000, 0.8).setOrigin(0);
    this.RaceDescriptionText = this.scene.add.text(615, 5, "", { align: "left", fontSize: 13, fontFamily: "Mooli", wordWrap: { width: 595, useAdvancedWrap: true } }).setOrigin(0);
    this.RaceSelectionScreen = scene.add.container(0, 0).add([ 
      this.RaceOptionsList, this.RaceDescription, this.RaceScreenHeader, this.RaceDescriptionText
    ]).setVisible(false);

    // Create Faction Selection Screen;
    this.FactionScreenHeader = this.scene.add.text(0, 5, "Choose Faction", { align: "center", fontSize: 36, fontFamily: "Mooli"  }).setOrigin(0);
    this.FactionOptionsList = this.scene.add.rectangle(0, 0, 600, 800, 0x000000, 0.8).setOrigin(0);
    this.FactionDescription = this.scene.add.rectangle(610, 0, 600, 800, 0x000000, 0.8).setOrigin(0);
    this.FactionDescriptionText = this.scene.add.text(615, 5, "", { align: "left", fontSize: 13, fontFamily: "Mooli", wordWrap: { width: 595, useAdvancedWrap: true } }).setOrigin(0);
    this.FactionSelectionScreen = scene.add.container(0, 0).add([
      this.FactionOptionsList, this.FactionDescription, this.FactionScreenHeader, this.FactionDescriptionText
    ]).setVisible(false);

    this.add([
      this.ClassSelectionScreen,
      this.FactionSelectionScreen,
      this.RaceSelectionScreen,
      new Button(this.scene, this.scene.scale.width * 0.2, this.scene.scale.height * 0.95, 'button1', 'button2', "Cancel", this.scene.CancelCharacterCreation.bind(this.scene)),
      new Button(this.scene, this.scene.scale.width * 0.4, this.scene.scale.height * 0.95, 'button1', 'button2', "Back", this.GoToPreviouStep.bind(this)),
      new Button(this.scene, this.scene.scale.width * 0.6, this.scene.scale.height * 0.95, 'button1', 'button2', "Next", this.GoToNextStep.bind(this)),
      new Button(this.scene, this.scene.scale.width * 0.8, this.scene.scale.height * 0.95, 'button1', 'button2', "Confirm", this.AttemptToCreateCharacter.bind(this)).setVisible(false),
    ]);

    this.setVisible(false);
    this.scene.add.existing(this);
  }

  setOptions () {

    let ClassY = this.ClassScreenHeader.getBottomCenter().y + 5;
    this.scene.Classes.forEach(v => {

      const text = this.scene.add.text(5, ClassY, v.name, { 
        fontSize: 24, fontFamily: "Mooli"
      }).setInteractive()
      .on('pointerover', () => {
        text.setTint(0x07c9e3);
      })
      .on('pointerout', () => {
        text.clearTint();
      })
      .on('pointerdown', () => {
        text.setTint(0x2abf4f);
        this.character.class = v.name;
        this.ClassDescriptionText.setText(v.description);
        console.log(this.character);
      });

      this.ClassSelectionScreen.add(text);
      ClassY += 24;
    });

    let RaceY = this.RaceScreenHeader.getBottomCenter().y + 5;
    this.scene.Races.forEach(v => {
      const text = this.scene.add.text(5, RaceY, v.name, { 
        fontSize: 24, fontFamily: "Mooli"
      }).setInteractive()
      .on('pointerover', () => {
        text.setTint(0x07c9e3);
      })
      .on('pointerout', () => {
        text.clearTint();
      })
      .on('pointerdown', () => {
        text.setTint(0x2abf4f);
        this.character.race = v.name;
        this.RaceDescriptionText.setText(v.description);
        console.log(this.character);
      });
      this.RaceSelectionScreen.add(text);
      RaceY += 24;
    });

    let FactionY = this.FactionScreenHeader.getBottomCenter().y + 5;
    this.scene.Factions.forEach(v => {
      const text = this.scene.add.text(5, FactionY, v.name, { 
        fontSize: 24, fontFamily: "Mooli"
      })
      .setInteractive()
      .on('pointerover', () => {
        text.setTint(0x07c9e3);
      })
      .on('pointerout', () => {
        text.clearTint();
      })
      .on('pointerdown', () => {
        text.setTint(0x2abf4f);
        this.character.faction = v.name;
        this.FactionDescriptionText.setText(v.description);
        console.log(this.character);
      });
      this.FactionSelectionScreen.add(text);
      FactionY += 24;
    });

  }

  async AttemptToCreateCharacter ( character: any ) {
    const Result = await axios.post<{ message: string }>(`http://localhost:8082/create_character`, { 
      Character: this.character
    });
    console.log(Result);
    //self.MakeCharacterSlot({ id: response.id, name: CharacterName, class: CharacterClass, faction: CharacterFaction, race: CharacterRace });
    //self.CancelCharacterCreation();
  }

  HidePanels () {
    this.ClassSelectionScreen.setVisible(false);
    this.FactionSelectionScreen.setVisible(false);
    this.RaceSelectionScreen.setVisible(false);
  }

  GoToNextStep () {
    this.HidePanels();
    this.step++;
    if ( this.step >= 3 ) this.step = 3;
    this.ShowActiveStep();
  }

  GoToPreviouStep () {
    this.HidePanels();
    this.step--;
    if ( this.step <= 0 ) this.step = 1;
    this.ShowActiveStep();
  }

  ShowActiveStep () {
    if ( this.step == 1 ) this.ClassSelectionScreen.setVisible(true)
    else if ( this.step == 2 ) this.FactionSelectionScreen.setVisible(true);
    else if ( this.step == 3 ) this.RaceSelectionScreen.setVisible(true);
  }

}
