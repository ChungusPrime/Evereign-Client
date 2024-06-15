import axios from "axios";
import Menu from "../scenes/menu";
import Button from "./button";
import Text from "./text";
import ModularButton from "./ModularButton";

export default class CharacterCreation extends Phaser.GameObjects.Container {

  scene: Menu;
  step: number;
  character: any;

  // Class
  ClassSelectionScreen: Phaser.GameObjects.Container;
  ClassScreenHeader: Phaser.GameObjects.Text;
  ClassOptionsList: Phaser.GameObjects.Rectangle;
  
  // Race
  RaceSelectionScreen: Phaser.GameObjects.Container;
  RaceScreenHeader: Phaser.GameObjects.Text;
  RaceOptionsList: Phaser.GameObjects.Rectangle;

  // Attributes
  AttributePoints: number;
  AttributePointsRemainingText: Phaser.GameObjects.Text;
  AttributeAssignmentScreen: Phaser.GameObjects.Container;
  AttributeHeader: Phaser.GameObjects.Text;
  AttributeOptions: Phaser.GameObjects.Rectangle;

  StrengthText: Phaser.GameObjects.Text;
  IncreaseStrengthButton: ModularButton;
  DecreaseStrengthButton: ModularButton;

  IntelligenceText: Phaser.GameObjects.Text;
  IncreaseIntelligenceButton: ModularButton;
  DecreaseIntelligenceButton: ModularButton;

  WillpowerText: Phaser.GameObjects.Text;
  IncreaseWillpowerButton: ModularButton;
  DecreaseWillpowerButton: ModularButton;

  AgilityText: Phaser.GameObjects.Text;
  IncreaseAgilityButton: ModularButton;
  DecreaseAgilityButton: ModularButton;

  EnduranceText: Phaser.GameObjects.Text;
  IncreaseEnduranceButton: ModularButton;
  DecreaseEnduranceButton: ModularButton;

  PersonalityText: Phaser.GameObjects.Text;
  IncreasePersonalityButton: ModularButton;
  DecreasePersonalityButton: ModularButton;

  // Descriptions
  OptionDescriptionBackground: Phaser.GameObjects.Rectangle;
  OptionDescriptionText: Phaser.GameObjects.Text;

  // Navigation
  NextStepButton: Button;
  PreviousStepButton: Button;
  CancelButton: Button;
  CreateButton: Button;

  constructor ( scene: Menu, x: number, y: number ) {

    super( scene, x, y );
    
    this.scene = scene;
    this.x = x;
    this.y = y;

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

    this.step = 1;
    this.AttributePoints = 5;

    // Create Class Selection Screen;
    this.ClassScreenHeader = scene.add.text(this.scene.scale.width * 0.1 + 10, this.scene.scale.height * 0.1 + 10, "Choose Class", { align: "center", fontSize: "36px", fontFamily: "Mooli" }).setOrigin(0);
    this.ClassOptionsList = scene.add.rectangle(this.scene.scale.width * 0.1, this.scene.scale.height * 0.1, this.scene.scale.width * 0.4, this.scene.scale.height * 0.8, 0x000000, 0.8).setOrigin(0).setStrokeStyle(2, 0xffffff, 1);
    this.ClassSelectionScreen = scene.add.container(0, 0).add([ this.ClassOptionsList, this.ClassScreenHeader ]).setVisible(true);

    // Create Race Selection Screen;
    this.RaceScreenHeader = scene.add.text(this.scene.scale.width * 0.1 + 10, this.scene.scale.height * 0.1 + 10, "Choose Race", { align: "center", fontSize: "36px", fontFamily: "Mooli" }).setOrigin(0);
    this.RaceOptionsList = scene.add.rectangle(this.scene.scale.width * 0.1, this.scene.scale.height * 0.1, this.scene.scale.width * 0.4, this.scene.scale.height * 0.8, 0x000000, 0.8).setOrigin(0).setStrokeStyle(2, 0xffffff, 1);
    this.RaceSelectionScreen = scene.add.container(0, 0).add([ this.RaceOptionsList, this.RaceScreenHeader ]).setVisible(false);

    // Attribute Assignment Screen;
    this.AttributeHeader = scene.add.text(10, 10, "Assign Attribute Points", { align: "center", fontSize: "36px", fontFamily: "Mooli"  }).setOrigin(0);
    this.AttributePointsRemainingText = scene.add.text(this.scene.scale.width * 0.1 + 10, this.AttributeHeader.getBottomCenter().y + 10, `Points Left: ${this.AttributePoints}`, { align: "center", fontSize: "20px", fontFamily: "Mooli" }).setOrigin(0);
    this.AttributeOptions = scene.add.rectangle(this.scene.scale.width * 0.1 + 5, 5, this.scene.scale.width * 0.4, this.scene.scale.height * 0.8, 0x000000, 0.8).setOrigin(0).setStrokeStyle(2, 0xffffff, 1);

    this.StrengthText = scene.add.text(50, this.AttributePointsRemainingText.getBottomCenter().y + 10, `Strength ${this.character.strength}`, { align: "left", fontSize: "20px", fontFamily: "Mooli"  }).setOrigin(0);
    this.IncreaseStrengthButton = new ModularButton(this.scene, this.StrengthText.getRightCenter().x + 20, this.StrengthText.y, 20, 20, "Grey-Small", "+", this.IncreaseStat.bind(this, "strength"), 0);
    this.DecreaseStrengthButton = new ModularButton(this.scene, this.StrengthText.getLeftCenter().x - 25, this.StrengthText.y, 20, 20, "Grey-Small", "-", this.DecreaseStat.bind(this, "strength"), 0);

    this.IntelligenceText = scene.add.text(50, this.StrengthText.getBottomCenter().y + 20, `Intelligence ${this.character.intelligence}`, { align: "left", fontSize: "20px", fontFamily: "Mooli"  }).setOrigin(0);
    this.IncreaseIntelligenceButton = new ModularButton(this.scene, this.IntelligenceText.getRightCenter().x + 20, this.IntelligenceText.y, 20, 20, "Grey-Small", "+", this.IncreaseStat.bind(this, "intelligence"), 0);
    this.DecreaseIntelligenceButton = new ModularButton(this.scene, this.IntelligenceText.getLeftCenter().x - 25, this.IntelligenceText.y, 20, 20, "Grey-Small", "-", this.DecreaseStat.bind(this, "intelligence"), 0);

    this.WillpowerText = scene.add.text(50, this.IntelligenceText.getBottomCenter().y + 20, `Willpower ${this.character.willpower}`, { align: "left", fontSize: "20px", fontFamily: "Mooli"  }).setOrigin(0);
    this.IncreaseWillpowerButton = new ModularButton(this.scene, this.WillpowerText.getRightCenter().x + 20, this.WillpowerText.y, 20, 20, "Grey-Small", "+", this.IncreaseStat.bind(this, "willpower"), 0);
    this.DecreaseWillpowerButton = new ModularButton(this.scene, this.WillpowerText.getLeftCenter().x - 25, this.WillpowerText.y, 20, 20, "Grey-Small", "-", this.DecreaseStat.bind(this, "willpower"), 0);

    this.AgilityText = scene.add.text(50, this.WillpowerText.getBottomCenter().y + 20, `Agility ${this.character.agility}`, { align: "left", fontSize: "20px", fontFamily: "Mooli"  }).setOrigin(0);
    this.IncreaseAgilityButton = new ModularButton(this.scene, this.AgilityText.getRightCenter().x + 20, this.AgilityText.y, 20, 20, "Grey-Small", "+", this.IncreaseStat.bind(this, "agility"), 0);
    this.DecreaseAgilityButton = new ModularButton(this.scene, this.AgilityText.getLeftCenter().x - 25, this.AgilityText.y, 20, 20, "Grey-Small", "-", this.DecreaseStat.bind(this, "agility"), 0);

    this.EnduranceText = scene.add.text(50, this.AgilityText.getBottomCenter().y + 20, `Endurance ${this.character.endurance}`, { align: "left", fontSize: "20px", fontFamily: "Mooli"  }).setOrigin(0);
    this.IncreaseEnduranceButton = new ModularButton(this.scene, this.EnduranceText.getRightCenter().x + 20, this.EnduranceText.y, 20, 20, "Grey-Small", "+", this.IncreaseStat.bind(this, "endurance"), 0);
    this.DecreaseEnduranceButton = new ModularButton(this.scene, this.EnduranceText.getLeftCenter().x - 25, this.EnduranceText.y, 20, 20, "Grey-Small", "-", this.DecreaseStat.bind(this, "endurance"), 0);

    this.PersonalityText = scene.add.text(50, this.EnduranceText.getBottomCenter().y + 20, `Personality ${this.character.personality}`, { align: "left", fontSize: "20px", fontFamily: "Mooli"  }).setOrigin(0);
    this.IncreasePersonalityButton = new ModularButton(this.scene, this.PersonalityText.getRightCenter().x + 20, this.PersonalityText.y, 20, 20, "Grey-Small", "+", this.IncreaseStat.bind(this, "personality"), 0);
    this.DecreasePersonalityButton = new ModularButton(this.scene, this.PersonalityText.getLeftCenter().x - 25, this.PersonalityText.y, 20, 20, "Grey-Small", "-", this.DecreaseStat.bind(this, "personality"), 0);

    this.AttributeAssignmentScreen = scene.add.container(0, 0).add([
      this.AttributeOptions, 
      this.AttributeHeader, 
      this.AttributePointsRemainingText,
      this.StrengthText,
      this.IncreaseStrengthButton,
      this.DecreaseStrengthButton,
      this.IntelligenceText,
      this.IncreaseIntelligenceButton,
      this.DecreaseIntelligenceButton,
      this.WillpowerText,
      this.IncreaseWillpowerButton,
      this.DecreaseWillpowerButton,
      this.AgilityText,
      this.IncreaseAgilityButton,
      this.DecreaseAgilityButton,
      this.EnduranceText,
      this.IncreaseEnduranceButton,
      this.DecreaseEnduranceButton,
      this.PersonalityText,
      this.IncreasePersonalityButton,
      this.DecreasePersonalityButton
    ]).setVisible(false);

    this.OptionDescriptionBackground = scene.add.rectangle(this.ClassOptionsList.getTopRight().x + 10, this.scene.scale.height * 0.1, this.scene.scale.width * 0.4, this.scene.scale.height * 0.8, 0x000000, 0.8).setOrigin(0).setStrokeStyle(2, 0xffffff, 1);
    this.OptionDescriptionText = scene.add.text(this.ClassOptionsList.getTopRight().x + 15, this.scene.scale.height * 0.1 + 10, "", { align: "left", fontSize: 13, fontFamily: "Mooli", wordWrap: { width: this.scene.scale.width * 0.4 - 10, useAdvancedWrap: true } }).setOrigin(0);

    this.CancelButton = new Button(scene, this.scene.scale.width * 0.2, this.scene.scale.height * 0.95, 'button1', 'button2', "Cancel", this.CancelCharacterCreation.bind(this)),
    this.PreviousStepButton = new Button(scene, this.scene.scale.width * 0.4, this.scene.scale.height * 0.95, 'button1', 'button2', "Back", this.GoToPreviouStep.bind(this)),
    this.NextStepButton = new Button(scene, this.scene.scale.width * 0.6, this.scene.scale.height * 0.95, 'button1', 'button2', "Next", this.GoToNextStep.bind(this)),
    this.CreateButton = new Button(scene, this.scene.scale.width * 0.8, this.scene.scale.height * 0.95, 'button1', 'button2', "Confirm", this.CreateCharacter.bind(this)),

    this.add([
      this.ClassSelectionScreen,
      this.RaceSelectionScreen,
      this.AttributeAssignmentScreen,
      this.OptionDescriptionBackground,
      this.OptionDescriptionText,
      this.CancelButton,
      this.PreviousStepButton,
      this.NextStepButton,
      this.CreateButton
    ]);

    this.setVisible(false);
    this.scene.add.existing(this);
  }

  IncreaseStat ( stat: string ) {
    if ( this.AttributePoints == 0 ) return;
    this.AttributePoints--;
    this.character[stat]++;
    this.AttributePointsRemainingText.setText(`Points Left: ${this.AttributePoints}`);
    this.UpdateAttributeDisplay();
  }

  DecreaseStat ( stat: string ) {
    if ( this.AttributePoints == 5 ) return;
    this.AttributePoints++;
    this.character[stat]--;
    this.AttributePointsRemainingText.setText(`Points Left: ${this.AttributePoints}`);
    this.UpdateAttributeDisplay();
  }

  UpdateAttributeDisplay() {
    this.StrengthText.setText(`Strength ${this.character.strength}`);
    this.WillpowerText.setText(`Willpower ${this.character.willpower}`);
    this.EnduranceText.setText(`Endurance ${this.character.endurance}`);
    this.AgilityText.setText(`Agility ${this.character.agility}`);
    this.PersonalityText.setText(`Personality ${this.character.personality}`);
    this.IntelligenceText.setText(`Intelligence ${this.character.intelligence}`);
  }

  setOptions () {

    let ClassY = this.ClassScreenHeader.getBottomCenter().y + 5;
    /*this.scene.Classes.forEach(v => {
      const text = new Text(this.scene, this.scene.scale.width * 0.1 + 10, ClassY, v.name, 24, false);
      text.on('pointerdown', () => {
        this.character.class = v.name;
        this.OptionDescriptionText.setText(v.description);
      });
      this.ClassSelectionScreen.add(text);
      ClassY += 30;
    });*/

    let RaceY = this.RaceScreenHeader.getBottomCenter().y + 5;
    /*this.scene.Races.forEach(v => {
      const text = new Text(this.scene, this.scene.scale.width * 0.1 + 10, RaceY, v.name, 24, false);
      text.on('pointerdown', () => {
        this.character.race = v.name;
        this.OptionDescriptionText.setText(v.description);
      });
      this.RaceSelectionScreen.add(text);
      RaceY += 30;
    });*/

  }

  async CreateCharacter () {

    console.log(this.scene.Server);

    const Result = await axios.post<{ message: string }>(`${this.scene.Server}/create_character`, { 
      Character: this.character,
      UserID: this.scene.AccountID
    });

    console.log(Result);
    //self.MakeCharacterSlot({ id: response.id, name: CharacterName, class: CharacterClass, faction: CharacterFaction, race: CharacterRace });
    //self.CancelCharacterCreation();
  }

  GoToNextStep () {
    this.step++;
    if ( this.step >= 3 ) this.step = 3;
    this.ShowActiveStep();
  }

  GoToPreviouStep () {
    this.step--;
    if ( this.step <= 0 ) this.step = 1;
    this.ShowActiveStep();
  }

  ShowActiveStep () {
    this.ClassSelectionScreen.setVisible(false);
    this.RaceSelectionScreen.setVisible(false);
    this.AttributeAssignmentScreen.setVisible(false);
    switch( this.step ) {
      case 1: this.ClassSelectionScreen.setVisible(true); break;
      case 2: this.RaceSelectionScreen.setVisible(true); break;
      case 3: this.AttributeAssignmentScreen.setVisible(true); break;
    }
  }

  CancelCharacterCreation () {
    this.scene.CharacterListPanel.setVisible(true);
    //this.scene.CharacterCreationPanel.setVisible(false);
  }

}
