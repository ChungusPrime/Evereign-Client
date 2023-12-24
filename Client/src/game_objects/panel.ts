import Game from "../scenes/game";

export default class Panel extends Phaser.GameObjects.Container {

    public scene: Game;
    
    public CloseButton: Phaser.GameObjects.Image;
    public ContentBackground: Phaser.GameObjects.Rectangle;
    public ContentContainer: Phaser.GameObjects.Container;
    public HeaderText: Phaser.GameObjects.Text;
    public HeaderBackground: Phaser.GameObjects.Rectangle;
    public CloseButtonText: Phaser.GameObjects.Text;

    // TODO: REMOVE, SEE TOWN_UI LINE 38
    public CameraScrollY: number = 0;
    public Camera: Phaser.Cameras.Scene2D.Camera;
    
    constructor ( scene: Game, title: string ) {

        super(scene, 0, 0);

        this.scene = scene;

        // Panel Header
        this.HeaderBackground = this.scene.add.rectangle(this.scene.cameras.main.width / 2, this.scene.cameras.main.height * 0.2, 600, 60, 0x000000, 0.75);
        this.HeaderBackground.setStrokeStyle(1, 0xffffff, 1);
        this.HeaderBackground.setOrigin(0.5);

        // Header Text
        this.HeaderText = this.scene.add.text(this.HeaderBackground.getTopCenter().x, this.HeaderBackground.getTopCenter().y + 24, title, { fontSize: 32, align: "center" }).setOrigin(0.5, 0);
        Phaser.Display.Align.In.Center(this.HeaderText, this.HeaderBackground);

        // Main Content Background
        this.ContentBackground = this.scene.add.rectangle(this.HeaderBackground.getBottomLeft().x, this.HeaderBackground.getBottomCenter().y + 5, 600, 600, 0x000000, 0.75);
        this.ContentBackground.setStrokeStyle(1, 0xffffff, 1);
        this.ContentBackground.setOrigin(0);
        this.ContentBackground.setInteractive();

        // Content Container
        this.ContentContainer = this.scene.add.container(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y);
        this.ContentContainer.width = this.ContentBackground.width;
        
        // Close Button
        this.CloseButton = this.scene.add.image(this.HeaderBackground.x, this.HeaderBackground.y, "panel-small");
        this.CloseButtonText = this.scene.add.text(this.CloseButton.x, this.CloseButton.y, "X", { fontSize: 24 });
        this.CloseButton.setInteractive();
        this.CloseButton.on('pointerdown', () => { this.hide() }, this);
        Phaser.Display.Align.In.RightCenter(this.CloseButton, this.HeaderBackground, -5);
        Phaser.Display.Align.In.Center(this.CloseButtonText, this.CloseButton);

        this.setVisible(false);
        this.setActive(false);
        
        // Camera 
        // TODO: REMOVE, SEE TOWN_UI LINE 38
        this.Camera = this.scene.cameras.add(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y, 600, 600);
        this.Camera.setBounds(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y, 600, 1200);
        this.Camera.setName(title + " Camera");
        this.Camera.setOrigin(0);
        this.Camera.inputEnabled = true;
        this.Camera.setVisible(false);
        // We want the camera for this panel to ignore everything in it, except the actual content, because the panel background is being rendered by the main scene camera
        this.Camera.ignore([ this.ContentBackground, this.HeaderBackground, this.HeaderText, this.CloseButton, this.CloseButtonText ]);
        // We want the main scene camera to ignore the content, because the content is being rendered by this camera
        this.scene.cameras.main.ignore(this.ContentContainer);
        this.ContentBackground.on("wheel", ( pointer: Phaser.Input.Pointer ) => {
            this.Camera.scrollY += pointer.deltaY;
        });

        this.add([
            this.ContentBackground,
            this.HeaderBackground,
            this.HeaderText,
            this.CloseButton,
            this.CloseButtonText,
            this.ContentContainer,
        ]);

        this.scene.add.existing(this);
    }

    show () {
        this.setActive(true);
        this.setVisible(true);
        this.Camera.setVisible(true);
    }

    hide () {
        this.setActive(false);
        this.setVisible(false);
        this.Camera.setVisible(false);
        //this.scene.ActivePanel = null;
    }

    setCameraBoundsHeight () {
        let height = 0;

        this.ContentContainer.getAll().forEach( (child: any) => {
            height += child.height;
        });

        height += 5;

        this.Camera.setBounds(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y, 600, height);
    }

}