import axios from "axios";
import Menu from "../scenes/menu";
import Button from "./button";
import Text from "./text";

export default class CharacterCreation extends Phaser.GameObjects.Container {
  scene: Menu;
  step: number;
  attribute_points: number;
  character: { name: string; class: string; faction: string; race: string; strength: number; intelligence: number; willpower: number; agility: number; endurance: number; personality: number; };
  classes: any[];
  factions: any[];
  races: any[];
  ClassSelectionScreen: any;
  FactionSelectionScreen: any;
  RaceSelectionScreen: any;
  AttributeAssignmentScreen: any;
  points_remaining_text: Text;
  attributes: string[];
  
  constructor ( scene: Menu, x: number, y: number ) {
    super(scene, x, y);
    this.scene = scene;
    this.x = x;
    this.y = y;

    this.step = 1;
    this.attribute_points = 6;
    this.character = {
      name: "",
      class: "",
      faction: "",
      race: "",
      strength: 0,
      intelligence: 0,
      willpower: 0,
      agility: 0,
      endurance: 0,
      personality: 0
    };

    this.classes = [];
    this.factions = [];
    this.races = [];

    // Create Class Selection Screen;
    this.ClassSelectionScreen = scene.add.container(0, 0).setSize(scene.scale.width, scene.scale.height).setVisible(true);
    this.ClassSelectionScreen.add([
      this.scene.add.rectangle(scene.scale.width * 0.2, scene.scale.height * 0.2, 600, 800, 0x000000, 0.8),
      this.scene.add.rectangle(scene.scale.width * 0.5, scene.scale.height * 0.2, 600, 800, 0x000000, 0.8),
      this.scene.add.text(scene.scale.width * 0.5, scene.scale.height * 0.1, "Choose Class")
    ]);

    let ClassY = 5;
    this.classes.forEach(v => {
      const text = this.scene.add.text(5, ClassY, v.name);
      this.ClassSelectionScreen.add(text);
      ClassY += 12;
    });

    this.add(this.ClassSelectionScreen);

    this.setVisible(false);
    this.scene.add.existing(this);

    // Create Faction Selection Screen;
    /*this.FactionSelectionScreen = scene.add.container(0, 0).setSize(scene.scale.width, scene.scale.height).setVisible(false);
    this.FactionSelectionScreen.add(new Text(scene, scene.scale.width * 0.5, scene.scale.height * 0.15, "Choose Faction", 64));
    var FactionX = 0.17;
    this.factions.forEach(value => {
      var panel = scene.add.image(this.FactionSelectionScreen.width * FactionX, this.FactionSelectionScreen.height * 0.5, 'panel').setDisplaySize(scene.scale.width * 0.32, scene.scale.height * 0.55).setOrigin(0.5);
      var header = new Text(scene, this.FactionSelectionScreen.width * FactionX, this.FactionSelectionScreen.height * 0.28, value.name, 28, true);
      var wrap = { width: scene.scale.width * 0.29, useAdvancedWrap: true };
      var description = new Text(scene, this.FactionSelectionScreen.width * FactionX, this.FactionSelectionScreen.height * 0.30, value.description, 18, true).setOrigin(0.5, 0);
      //var select_button = new Button(sc, this.FactionSelectionScreen.width * FactionX, this.FactionSelectionScreen.height * 0.71, 'button1', 'button2', "Select", this.SetFaction.bind(this, value.name));
      //var container = scene.add.container(0, 0, [panel, header, description, select_button]);
      //this.FactionSelectionScreen.add(container);
      FactionX += 0.33;
    });



    // Create Race Selection Screen;
    this.RaceSelectionScreen = scene.add.container(0, 0).setSize(scene.scale.width, scene.scale.height).setVisible(false);
    this.RaceSelectionScreen.add(new Text(scene, scene.scale.width * 0.5, scene.scale.height * 0.15, "Choose Race", 64),);

    var RaceX = 0.14;
    this.races.forEach(value => {
      var panel = scene.add.image(this.RaceSelectionScreen.width * RaceX, this.RaceSelectionScreen.height * 0.45, 'panel').setDisplaySize(scene.scale.width * 0.24, scene.scale.height * 0.55).setOrigin(0.5);
      var header = new Text(scene, this.RaceSelectionScreen.width * RaceX, this.RaceSelectionScreen.height * 0.24, value.name, 28, true);
      var wrap = { width: scene.scale.width * 0.22, useAdvancedWrap: true };
      var description = new Text(scene, this.RaceSelectionScreen.width * RaceX, this.RaceSelectionScreen.height * 0.26, value.description, 18, true).setOrigin(0.5, 0);
      //var select_button = new Button(sc, this.RaceSelectionScreen.width * RaceX, this.RaceSelectionScreen.height * 0.65, 'button1', 'button2', "Select", this.SetRace.bind(this, value.name));
      //var container = scene.add.container(0, 0, [panel, header, description, select_button]);
      //this.RaceSelectionScreen.add(container);
      RaceX += 0.25;
    });



    // Create Attribute Assignment Screen;
    this.AttributeAssignmentScreen = scene.add.container(0, 0).setSize(scene.scale.width, scene.scale.height).setVisible(false);
    this.points_remaining_text = new Text(scene, scene.scale.width * 0.5, scene.scale.height * 0.15, "5 Points Remaining", 32);
    this.AttributeAssignmentScreen.add([
      new Text(scene, scene.scale.width * 0.5, scene.scale.height * 0.1, "Assign Attributes", 64),
      this.points_remaining_text
    ]);

    this.attributes = [
      'strength',
      'intelligence',
      'willpower',
      'agility',
      'endurance',
      'personality'
    ];

    var panel = scene.add.image(this.AttributeAssignmentScreen.width * 0.5, this.AttributeAssignmentScreen.height * 0.5, 'panel').setDisplaySize(scene.scale.width * 0.5, scene.scale.height * 0.5).setOrigin(0.5);
    this.AttributeAssignmentScreen.add(panel);
    var AttrY = 0.3;
    this.attributes.forEach(value => {
      var wrap = { 
        width: scene.scale.width * 0.32, useAdvancedWrap: true 
      };
      //var attr = new Text(sc, this.AttributeAssignmentScreen.width * 0.5, this.AttributeAssignmentScreen.height * AttrY, `${value}: ${this.character[value]}`, 48, true).setOrigin(0.5);
      //var minus_button = new Button(sc, this.AttributeAssignmentScreen.width * 0.3, this.AttributeAssignmentScreen.height * AttrY, 'button1', 'button2', "Decrease", this.DecreaseAttribute.bind(this, value, attr));
      //var plus_button = new Button(sc, this.AttributeAssignmentScreen.width * 0.7, this.AttributeAssignmentScreen.height * AttrY, 'button1', 'button2', "Increase", this.IncreaseAttribute.bind(this, value, attr));
      //var container = scene.add.container(0, 0, [attr, minus_button, plus_button]);
      //this.AttributeAssignmentScreen.add([container]);
      AttrY += 0.07;
    });

    this.setSize(scene.scale.width, scene.scale.height);

    this.add([
      this.ClassSelectionScreen,
      this.FactionSelectionScreen,
      this.RaceSelectionScreen,
      this.AttributeAssignmentScreen,
      new Button(this.scene, this.scene.scale.width * 0.2, this.scene.scale.height * 0.95, 'button1', 'button2', "Cancel", this.scene.CancelCharacterCreation.bind(this.scene)),
      new Button(this.scene, this.scene.scale.width * 0.4, this.scene.scale.height * 0.95, 'button1', 'button2', "Back", this.GoToPreviouStep.bind(this)),
      new Button(this.scene, this.scene.scale.width * 0.6, this.scene.scale.height * 0.95, 'button1', 'button2', "Next", this.GoToNextStep.bind(this)),
      new Button(this.scene, this.scene.scale.width * 0.8, this.scene.scale.height * 0.95, 'button1', 'button2', "Create", this.scene.AttemptToCreateCharacter.bind(this.scene, this.character)).setVisible(false),
    ]);

    this.setVisible(false);
    this.scene.add.existing(this);*/
  }

  async AttemptToCreateCharacter ( character: any ) {
    console.log( character );
    const result = await axios({
      method: 'post',
      url: 'http://localhost:8082/create_character',
      data: {
        Character: character
      }
    });
    console.log(result);
    return;
    //self.MakeCharacterSlot({ id: response.id, name: CharacterName, class: CharacterClass, faction: CharacterFaction, race: CharacterRace });
    //self.CancelCharacterCreation();
  }

  HidePanels () {
    //this.getAt(4).setVisible(false);
    this.ClassSelectionScreen.setVisible(false);
    this.FactionSelectionScreen.setVisible(false);
    this.RaceSelectionScreen.setVisible(false);
    this.AttributeAssignmentScreen.setVisible(false);
  }

  GoToNextStep () {
    this.HidePanels();
    this.step++;
    if ( this.step >= 4 ) this.step = 4;
    this.ShowActiveStep();
  }

  GoToPreviouStep () {
    this.HidePanels();
    this.step--;
    if ( this.step <= 0 ) this.step = 1;
    this.ShowActiveStep();
  }

  ShowActiveStep() {
    if ( this.step == 1 ) {
      this.ClassSelectionScreen.setVisible(true);
    } else if ( this.step == 2 ) {
      this.FactionSelectionScreen.setVisible(true);
    } else if ( this.step == 3 ) {
      this.RaceSelectionScreen.setVisible(true);
    } else if ( this.step == 4 ) {
      this.AttributeAssignmentScreen.setVisible(true);
    }

    if ( this.step == 4 ) {
      //this.getAt(7).setVisible(true);
    }

    if ( this.step != 5 ) {
      //this.getAt(5).setVisible(true);
    }

    if ( this.step != 1 ) {
      //this.getAt(4).setVisible(true);
    }

  }

  /*IncreaseAttribute ( val, text ) {
    if ( this.attribute_points == 0 ) return;
    this.attribute_points--;
    this.character[val]++;
    text.setText(`${val}: ${this.character[val]}`);
    this.points_remaining_text.setText(this.attribute_points + " Points Remaining");
  }

  DecreaseAttribute ( val, text ) {
    if ( this.attribute_points == 5 ) return;
    this.attribute_points++;
    this.character[val]--;
    text.setText(`${val}: ${this.character[val]}`);
    this.points_remaining_text.setText(this.attribute_points + " Points Remaining");
  }

  SetRace ( race ) {
    this.character.race = race;
    console.log(this.character);
  }

  SetFaction ( faction ) {
    this.character.faction = faction;
    console.log(this.character);
  }

  SetClass ( value ) {
    this.character.class = value;
    console.log(this.character);
  }

  ShowClassInfo ( container ) {
    // 2 = desc text, 3 = info text
    // 5 = desc button, 4 = info button
    container.getAt(2).setVisible(false);
    container.getAt(3).setVisible(true);
    container.getAt(4).setVisible(false);
    container.getAt(5).setVisible(true);
  }

  ShowClassDescription ( container ) {
    // 2 = desc text, 3 = info text
    // 5 = desc button, 4 = info button
    container.getAt(2).setVisible(true);
    container.getAt(3).setVisible(false);
    container.getAt(4).setVisible(true);
    container.getAt(5).setVisible(false);
  }*/
  
}
