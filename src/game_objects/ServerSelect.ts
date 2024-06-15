import axios from "axios";
import Menu from "../scenes/menu";
import ModularButton from "./ModularButton";

export default class ServerSelect {

    // Setup
    Scene: Menu;
    Width: number;
    Height: number;

    // Panel content
    Background: Phaser.GameObjects.Rectangle;
    Container: Phaser.GameObjects.Container;
    Header: Phaser.GameObjects.Text;

    InputColour: Number = 0x2E8FA0;
    SelectedInputColour: Number = 0x0D6B7C;
    
    constructor ( Scene: Menu ) {

        this.Scene = Scene;
        this.Width = Scene.scale.width * 0.5;
        this.Height = Scene.scale.height * 0.5;
        this.Scene.input.keyboard.on('keydown', ( event: KeyboardEvent ) => {});
        this.Background = Scene.add.rectangle(0, 0, this.Width, this.Height, 0x000000, 0).setOrigin(0, 0).setStrokeStyle(2, 0xffffff, 0);
        this.Header = Scene.add.text(this.Width / 2, 10, "Select Realm").setOrigin(0.5).setVisible(false);
        
        this.Container = Scene.add.container(
            (Scene.scale.width / 2 - this.Width / 2),
            (Scene.scale.height / 2 - this.Height / 2)
        );

        this.Container.add([
            this.Background,
            this.Header,
        ]);

        Scene.add.existing(this.Container);
        this.Container.setVisible(false);
    }

    Show () {
        this.Container.setVisible(true);
    }

    Hide () {
        this.Container.setVisible(false);
    }

    UpdateList() {
        this.Scene.Realms.forEach(realm => {
			let button = new ModularButton(this.Scene, 0, 0, this.Width, 60, "Grey", `${realm.name} - ${realm.status} - ${realm.players} Players`, this.ConnectToGameServer.bind(this, realm.name, realm.address), 0);
            this.Container.add(button);
		});
	}

	async ConnectToGameServer ( server: string, address: string ): Promise<boolean> {

		try {

			this.Scene.ServerSelectPanel.Hide();
			this.Scene.Message.setText(`Connecting to ${server}`).setVisible(true);
			this.Scene.Spinner.setVisible(true);

			const response = await axios.post<GameServerResponse>(`${address}/status`, { id: this.Scene.AccountID });

			if ( response.data.success == true ) {
				this.Scene.Message.setText("Connected").setVisible(false);
				this.Scene.Spinner.setVisible(false);
				this.Scene.Server = address;
				this.Scene.ServerSelectPanel.Hide();
				this.Scene.CharacterListPanel.UpdateList(response.data.characters);
				this.Scene.CharacterListPanel.setVisible(true);
				return true;
			}

			throw new Error(`Could not connect to ${server}`);
		
		} catch ( error ) {
			this.Scene.Message.setText(error).setVisible(true);
			this.Scene.Spinner.setVisible(false);
			this.Scene.ServerSelectPanel.Show();
		}

	}
  
}
