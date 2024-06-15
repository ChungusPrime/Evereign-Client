import Menu from "../scenes/menu";

export default class Input {

    Scene: Menu;
    Selected: boolean = false;
    Rectangle: Phaser.GameObjects.Rectangle;
    Placeholder: Phaser.GameObjects.Text;
    Value: Phaser.GameObjects.Text;

    constructor ( Scene: Menu ) {

        this.Scene = Scene;

        //this.Rectangle = Scene.add.rectangle(0, UsernameInputPosition.y + this.UsernameInput.height + 5, this.Width, this.Height * 0.25, 0xffffff, 1);

        this.Rectangle = Scene.add.rectangle(0, 0, 0, 0, 0xffffff, 1);
        this.Rectangle.setOrigin(0);
        this.Rectangle.setStrokeStyle(2, 0xffffff, 1);
        this.Rectangle.setInteractive();

        this.Rectangle.on('pointerdown', () => {
            this.Selected = true;
            this.Scene.sound.play('click');
        });

        const RectPosition = this.Rectangle.getTopLeft();

        this.Placeholder = Scene.add.text(RectPosition.x + 2, RectPosition.y + 5, "Input Title", {
            fontFamily: "Mooli"
        });

        this.Placeholder.setOrigin(0);
        
        this.Placeholder.setTint(0x000000);

        this.Value = Scene.add.text(
            this.Placeholder.getBottomLeft().x + 2,
            this.Placeholder.getBottomLeft().y + 4,
            "",
            {
                fontFamily: "Mooli",
                fontSize: 24,
                fixedWidth: this.Rectangle.width - 4,
                wordWrap: { 
                    width: this.Rectangle.width - 4,
                    useAdvancedWrap: true
                }
            }
        );
        
        this.Value.setOrigin(0)
        
        this.Value.setTint(0x000000);

    }



}