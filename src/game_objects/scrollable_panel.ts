export default class ScrollablePanel extends Phaser.GameObjects.Container {

    public scene: Phaser.Scene;
    public ContentBackground: Phaser.GameObjects.Rectangle;
    public ContentContainer: Phaser.GameObjects.Container;
    public HeaderText: Phaser.GameObjects.Text;
    public HeaderBackground: Phaser.GameObjects.Rectangle;

    constructor ( scene: Phaser.Scene, title: string, x: number, y: number, width: number, height: number, header: boolean, background: boolean ) {

        super ( scene, 0, 0 );

        this.scene = scene;

        this.x = x;
        this.y = y;
        this.setPosition(x, y);

        this.height = height;
        this.width = width;
        this.setSize(width, height);

        this.displayHeight = height;
        this.displayWidth = width;
        this.setDisplaySize(width, height);

        // Panel Header (10% of the total height);
        this.HeaderBackground = this.scene.add.rectangle(0, 0, width, height * 0.1, 0x000000, 0.75).setStrokeStyle(2, 0xffffff, 1).setOrigin(0);
        this.HeaderText = this.scene.add.text( this.HeaderBackground.getTopCenter().x, this.HeaderBackground.getTopCenter().y + 24, title, { fontSize: "2vh", align: "center", fontFamily: "Mooli" }).setOrigin(0.5, 0);
        Phaser.Display.Align.In.Center(this.HeaderText, this.HeaderBackground);

        // Main Content Background (90% of the total height)
        this.ContentBackground = this.scene.add.rectangle( this.HeaderBackground.getBottomLeft().x, this.HeaderBackground.getBottomCenter().y, width, height * 0.9, 0x000000, 0.75);
        this.ContentBackground.setStrokeStyle(2, 0xffffff, 1);
        this.ContentBackground.setOrigin(0);

        // Content Container
        this.ContentContainer = this.scene.add.container(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y);
        this.ContentContainer.setSize(this.ContentBackground.width, this.ContentBackground.height);
        this.ContentContainer.setDisplaySize(this.ContentBackground.width, this.ContentBackground.height);

        this.setVisible(false);
        this.setActive(false);
        this.add([ this.ContentBackground, this.HeaderBackground, this.HeaderText, this.ContentContainer ]);
        this.scene.add.existing(this);
    }

    show () {
        this.setActive(true).setVisible(true);
    }

    hide () {
        this.setActive(false).setVisible(false);
    }

}
