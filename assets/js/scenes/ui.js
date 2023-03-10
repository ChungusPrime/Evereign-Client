import CharacterPanel from "../scenes/UiPanels/Character.js";
import InventoryPanel from "../scenes/UiPanels/Inventory.js";
import AbilityPanel from "../scenes/UiPanels/Abilities.js";
import ProfessionsPanel from "../scenes/UiPanels/Professions.js";
import ReputationPanel from "../scenes/UiPanels/Reputation.js";
import QuestPanel from "../scenes/UiPanels/Quests.js";

import Quickbar from "../scenes/UiPanels/Quickbar.js";
import Tooltip from "../scenes/UiPanels/Tooltip.js";

import itemData from "../../../item_data.js";
import npcData from "../../../npc_data.js";
import abilityData from "../../../ability_data.js";

export default class UI extends Phaser.Scene {

  constructor () {
    super("UI");
  }

  init (player) {

    this.game = this.scene.get('Game');

    this.itemData = itemData;
    this.npcData = npcData;
    this.abilityData = abilityData;

    this.screens = this.add.group();
    this.openScreens = [];
    this.socket = this.game.socket;
    this.icons = ['Character', 'Inventory', 'Abilities', 'Professions', 'Quests', 'Reputation'];

    this.interactionPanel = this.add.container(400, 400, [
      this.add.image(0, 0, 'panel').setOrigin(0).setScale(4, 5)
    ]).setVisible(false);

    this.socket.on('move-item', (data) => { this.MoveItem(data) });

    this.menuBackground = this.add.graphics().fillStyle(0x000000).fillRect(0, 0, 1920, 30);
    this.levelText = this.add.text(5, 8, 'Level: 1', { fontSize: '16px', fill: '#fff' });
    this.xpText = this.add.text(100, 8, 'XP: 0/100', { fontSize: '16px', fill: '#fff' });

    // Set up icons and click listeners
    var x = 1750;
    this.icons.forEach((icon, k) => {
      this.add.image(x, 16, `${icon.toLowerCase()}Icon`).setScale(0.4).setInteractive().on('pointerdown', () => {
        this.changeMenu(icon);
      });
      x += 30;
    });

    this.levelText.setText(`Level: ${player.level}`);
    this.xpText.setText(`XP: ${player.exp}/100`);

    this.CharacterPanel = new CharacterPanel(this, player);
    this.InventoryPanel = new InventoryPanel(this, player.inventory);
    this.AbilityPanel = new AbilityPanel(this, player.abilities);
    this.ProfessionsPanel = new ProfessionsPanel(this, 100, 100);
    this.ReputationPanel = new ReputationPanel(this, 100, 100);
    this.QuestPanel = new QuestPanel(this, 100, 100);
    this.Quickbar = new Quickbar(this, player.quickbar);

    this.screens.addMultiple([ this.CharacterPanel, this.InventoryPanel, this.AbilityPanel, this.ProfessionsPanel, this.ReputationPanel, this.QuestPanel ]);

    // Chat window
    // this.Chat = new Chat();
    //this.add.graphics().fillStyle(0x000000, 0.7).fillRect(5, 880, 400, 195);

    // Create Tooltip
    this.Tooltip = new Tooltip(this);

    this.input.on('dragstart', (pointer, gameObject) => {
      gameObject.setTint(0xff0000);
      gameObject.setDepth(0);
    });

    this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });

    this.input.on('drop', (pointer, item, slot) => {

      console.log(item, slot);

      var itemData = this.itemData.find(i => i.item_id == item.item_id);

      if ( slot.contains != null ) {
        item.x = item.input.dragStartX;
        item.y = item.input.dragStartY;
        return;
      }

      this.game.socket.emit('move-item', { from: item.parentContainer.slot, to: slot.slot, id: item.id, item_id: item.item_id  });
    });

    this.input.on('dragend', (pointer, gameObject) => { gameObject.clearTint() });
    this.game.events.on('npc-interaction', (npc) => { this.interactWithNPC(npc) });
    this.game.events.on('click-npc', (id) => { this.printNpcInfo(id) });
  }

  printNpcInfo (id) {
    const npc = this.npcData.find(n => n.id == id);
    console.log(npc);
  }

  interactWithNPC ( id ) {
    console.log("interact with", id);
    //this.showInteractionPanel(npc);
    this.interactionPanel.setVisible(true);
    /*const npc = this.npcs.getChildren().find(n => n.id == id);

    var dist = Phaser.Math.Distance.BetweenPoints(this.player, npc);

    if ( dist > 65 ) {
      console.log("You need to be closer");
      return;
    }

    if ( npc.status == "Dead" ) {
      // Show loot window
    } else {
      this.showInteractionPanel(npc);
    }*/

  }

  MoveItem(data) {

    // Get The Origin Slot
    if (Number.isInteger(data.from)) {
      var originSlot = this.InventoryPanel.slots.find(s => s.slot == data.from)
    } else {
      var originSlot = this.CharacterPanel.slots.find(s => s.slot == data.from)
    }

    // The item to be moved is contained in the origin slot
    var item = originSlot.contains;
    originSlot.contains = null;

    // Get the Destination Slot
    if (Number.isInteger(data.to)) {
      var destinationSlot = this.InventoryPanel.slots.find(s => s.slot == data.to)
    } else {
      var destinationSlot = this.CharacterPanel.slots.find(s => s.slot == data.to)
    }

    destinationSlot.contains = item;
    destinationSlot.add(item);
    item.setPosition(23, 23).setDepth(0);

    item.inSlot = destinationSlot.slot;

  }

  changeMenu ( name ) {

    if ( name == "Inventory" || name == "Character" ) {
      this.screens.getChildren().forEach((scr, i) => {
        if ( scr.panelName != "Inventory" && scr.panelName != "Character") {
          scr.setVisible(false);
        }
      });
    } else {
      this.screens.setVisible(false);
    }

    this.screens.getChildren().find( s => s.panelName == name ).setVisible(true);

  }

}
