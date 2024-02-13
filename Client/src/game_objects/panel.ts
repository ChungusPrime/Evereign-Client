import Menu from "../scenes/menu";

export default class Panel extends Phaser.GameObjects.Container {

  public scene: Menu;
  
  public CameraScrollY: number = 0;
  public Camera: Phaser.Cameras.Scene2D.Camera;

  public ContentBackground: Phaser.GameObjects.Rectangle;
  public ContentContainer: Phaser.GameObjects.Container;
  public HeaderText: Phaser.GameObjects.Text;
  public HeaderBackground: Phaser.GameObjects.Rectangle;
    
  constructor ( scene: Menu, title: string, x: number, y: number, width: number, height: number, header: boolean = true, background: boolean = true ) {

    super( scene, x, y );

    this.scene = scene;

    this.x = x;
    this.y = y;
    
    this.height = height;
    this.width = width;

    this.displayHeight = height;
    this.displayWidth = width;

    this.setSize(width, height);
    this.setDisplaySize(width, height);

    // Panel Header
    // 10% of the total height
    this.HeaderBackground = this.scene.add.rectangle(x, y, width, height * 0.1, 0x000000, 0.75).setStrokeStyle(2, 0xffffff, 1).setOrigin(0);
    this.HeaderText = this.scene.add.text(this.HeaderBackground.getTopCenter().x, this.HeaderBackground.getTopCenter().y + 24, title, { fontSize: 24, align: "center", fontFamily: "Mooli" }).setOrigin(0.5, 0);
    Phaser.Display.Align.In.Center(this.HeaderText, this.HeaderBackground);

    // Main Content Background
    // 90% of the total height
    this.ContentBackground = this.scene.add.rectangle(this.HeaderBackground.getBottomLeft().x, this.HeaderBackground.getBottomCenter().y, width, height * 0.9, 0x000000, 0.75);
    this.ContentBackground.setStrokeStyle(2, 0xffffff, 1);
    this.ContentBackground.setOrigin(0);
    this.ContentBackground.setInteractive()
    .on("wheel", ( pointer: Phaser.Input.Pointer ) => {
      this.Camera.scrollY += pointer.deltaY;
    });

    // Content Container
    this.ContentContainer = this.scene.add.container(
      this.ContentBackground.getTopLeft().x,
      this.ContentBackground.getTopLeft().y
    )
    .setSize(this.ContentBackground.width, this.ContentBackground.height)
    .setDisplaySize(this.ContentBackground.width, this.ContentBackground.height);
    
    // Camera set up
    this.Camera = this.scene.cameras.add(
      this.ContentBackground.getTopLeft().x,
      this.ContentBackground.getTopLeft().y + 2,
      this.ContentBackground.width + 4,
      this.ContentBackground.height
    )
    .setName(`${title} Camera`)
    .setOrigin(0)
    .setVisible(false)
    .ignore([ this.ContentBackground, this.HeaderBackground, this.HeaderText ]);

    // By default the main scene camera should ignore the content, because its being rendered by this camera
    this.scene.cameras.main.ignore(this.ContentContainer);

    this.setVisible(false);
    this.setActive(false);

    this.add([ this.ContentBackground, this.HeaderBackground, this.HeaderText, this.ContentContainer ]);

    this.scene.add.existing(this);
  }

  show () {
    this.setActive(true).setVisible(true);
    this.Camera.setVisible(true);
  }

  hide () {
    this.setActive(false).setVisible(false);
    this.Camera.setVisible(false);
  }

  setCameraBoundsHeight () {
    let height = 0;
    this.ContentContainer.getAll().forEach( (child: any) => { height += child.button.displayHeight; });
    this.Camera.setBounds(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y, this.width, height + 60);
  }

  setCameraBoundsHeightGrid ( itemsPerRow: number ) {
    let height = 0;
    let count = 0;

    this.ContentContainer.getAll().forEach( (child: any) => {
      count++;
      if ( count == itemsPerRow ) {
        height += child.displayHeight;
        count = 0;
      }
    });

    this.Camera.setBounds(this.ContentBackground.getTopLeft().x, this.ContentBackground.getTopLeft().y, this.width, height);
  }

}
