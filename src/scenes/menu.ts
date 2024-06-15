import Button from "../game_objects/button";
import ModularButton from "../game_objects/ModularButton";
import ServerSelect from "../game_objects/ServerSelect";
import CharacterCreation from "../game_objects/CharacterCreation";
import CreateAccount from "../game_objects/CreateAccount";
import CharacterList from "../game_objects/CharacterList";
import Cursor from '../images/cursorGauntlet_blue.png';
import axios from 'axios';
import Login from "../game_objects/Login";

export default class Menu extends Phaser.Scene {

	// Player data
	public CharacterID: number = null;
	public SessionID: number = null;
	public AccountID: number = null;
	public Server: string = null;
	public Username: string = null;

	// Status
	public Message: Phaser.GameObjects.Text;
	public Spinner: Phaser.GameObjects.Image;
	public RetryButton: Button;
	public Disconnected: boolean = false;

	public ActivePanel: any = null;

	// Panels
	public LoginPanel: Login;
	public RegistrationPanel: CreateAccount;
	public ServerSelectPanel: ServerSelect;
	public CharacterCreationPanel: CharacterCreation;
	public CharacterListPanel: CharacterList;

	public Realms: { name: string, address: string, players: string, status: string }[] = [];

	public DataServers: { [key:string]: string } = {
		'production': 'http://66.245.193.154:8081',
		'development': 'http://localhost:8081'
	}

	public DataServerAddress: string = this.DataServers[process.env.NODE_ENV];

	public Background: Phaser.GameObjects.Image;
    public Races: any;
    public Classes: any;

	constructor() {
		super("Menu");
	}

	init(data: { disconnected: boolean }) {
		console.log(`${process.env.NODE_ENV} ${data.disconnected} ${this.DataServerAddress}`);
		this.Disconnected = data.disconnected;
	}

	async create() {

		this.input.mouse.disableContextMenu();

		this.sound.play('music1', {
			loop: true
		});

		this.input.setDefaultCursor(`url(${Cursor}), pointer`);

		this.Background = this.add.image(0, 0, 'menu-background').setDisplaySize(this.scale.width, this.scale.height).setOrigin(0);

		// Request in progress
		this.Spinner = this.add.image(this.scale.width / 2, this.scale.height * 0.90, 'spinner').setDisplaySize(this.scale.width * 0.05, this.scale.width * 0.05).setOrigin(0.5);

		this.Message = this.add.text(this.scale.width / 2, this.scale.height * 0.80, "Connecting to login server", {
			align: "center",
			fontSize: "2vw",
			fontFamily: 'Mooli'
		}).setOrigin(0.5);

		this.RetryButton = new Button(this, this.scale.width * 0.5, this.scale.height * 0.90, "button1", "button2", "Retry", this.GetAuthServerStatus.bind(this)).setVisible(false);

		// Set up panels
		this.LoginPanel = new Login(this);
		this.RegistrationPanel = new CreateAccount(this);
		this.ServerSelectPanel = new ServerSelect(this);
		this.CharacterListPanel = new CharacterList(this, 0, 0);
		this.CharacterCreationPanel = new CharacterCreation(this);
		

		await this.GetAuthServerStatus();
	}

	update(time: number, delta: number): void {
		this.Spinner.rotation += 0.01;
	}

	TestGame() {
		console.log(`LOAD GAME - CharID: ${this.CharacterID} - AccountID: ${this.AccountID} - Server: ${this.Server}`);
		this.sound.stopByKey('music1');
		this.scene.stop("Menu");
		this.scene.start("Game", {
			AccountID: "dae1d63f-7fc5-4b53-9ab3-c7e97f9d9e7d",
			CharacterID: 1,
			Server: "http://localhost:8082"
		});
	}

	// Check if the authentication server responds
	async GetAuthServerStatus(): Promise < boolean > {
		try {
			this.RetryButton.setVisible(false);
			this.Spinner.setVisible(true);
			this.Message.setText("Connecting to login server").setVisible(true);
			const response = await axios.post<{ success: boolean}>(`${this.DataServerAddress}/status`);
			if ( response.data.success == true ) {
				this.LoginPanel.Container.setVisible(true);
				this.ActivePanel = this.LoginPanel;
				this.Spinner.setVisible(false);
				this.Message.setVisible(false);
				return true;
			}
			throw new Error("Login server offline");
		} catch (error) {
			this.Message.setText("Login server offline");
			this.RetryButton.setVisible(true);
			this.Spinner.setVisible(false);
			return false;
		}
	}

}