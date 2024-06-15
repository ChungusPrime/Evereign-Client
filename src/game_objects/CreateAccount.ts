import axios from "axios";
import Menu from "../scenes/menu";
import ModularButton from "./ModularButton";

export default class CreateAccount {

    // Setup
    Scene: Menu;
    Width: number;
    Height: number;

    // Panel content
    HTML: Phaser.GameObjects.DOMElement;
    Background: Phaser.GameObjects.Rectangle;
    Container: Phaser.GameObjects.Container;
    Header: Phaser.GameObjects.Text;

    // UsernameInput: Input;
    // PasswordInput: Input;
    // EmailInput: Input;

    // Username
    UsernameInput: Phaser.GameObjects.Rectangle;
    UsernamePlaceholder: Phaser.GameObjects.Text;
    UsernameValue: Phaser.GameObjects.Text;

    // Password
    PasswordInput: Phaser.GameObjects.Rectangle;
    PasswordPlaceholder: Phaser.GameObjects.Text;
    PasswordValue: Phaser.GameObjects.Text;

    // Email
    EmailInput: Phaser.GameObjects.Rectangle;
    EmailPlaceholder: Phaser.GameObjects.Text;
    EmailValue: Phaser.GameObjects.Text;

    ActiveInput: Phaser.GameObjects.Text;

    ConfirmButton: ModularButton;
    CancelButton: ModularButton;

    InputColour: Number = 0x2E8FA0;
    SelectedInputColour: Number = 0x0D6B7C;
    
    constructor ( Scene: Menu ) {

        this.Scene = Scene;
        this.Width = Scene.scale.width * 0.2;
        this.Height = Scene.scale.height * 0.35;

        this.Scene.input.keyboard.on('keydown', ( event: KeyboardEvent ) => {

            if ( this.Scene.ActivePanel != this ) return;

            // if backspace, remove the last character
            if ( event.key == "Backspace" ) {
                let val = this.ActiveInput.text;
                val = val.slice(0, -1); 
                this.ActiveInput.setText(val);
                return;
            }

            // Only accept letters and numbers
            if ((/^[a-zA-Z0-9@.]$/.test(event.key))) {
                let val = this.ActiveInput.text + event.key;
                this.ActiveInput.setText(val);
                return;
            }

        });

        this.Background = Scene.add.rectangle(0, 0, this.Width, this.Height, 0x000000, 0)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0xffffff, 0);

        this.Header = Scene.add.text(this.Width / 2, 10, "Login")
        .setOrigin(0.5)
        .setVisible(false);

        //#region Username Input Setup
        this.UsernameInput = Scene.add.rectangle(0, 0, this.Width, this.Height * 0.25, 0xffffff, 1)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1)
        .setInteractive()
        .on('pointerdown', () => {
            this.Scene.sound.play('click');
            this.ActiveInput = this.UsernameValue;
            this.UsernameInput.setFillStyle(0xd1d1d1, 1);
            this.EmailInput.setFillStyle(0xffffff, 1);
            this.PasswordInput.setFillStyle(0xffffff, 1);
        });

        const UsernameInputPosition = this.UsernameInput.getTopLeft();
        this.UsernamePlaceholder = Scene.add.text(UsernameInputPosition.x + 2, UsernameInputPosition.y + 2, "Username", { fontFamily: "Mooli" }).setOrigin(0).setTint(0x000000);

        this.UsernameValue = Scene.add.text(
            this.UsernamePlaceholder.getBottomLeft().x + 2,
            this.UsernamePlaceholder.getBottomLeft().y + 4,
            "",
            {
                fontFamily: "Mooli",
                fontSize: 24,
                fixedWidth: this.UsernameInput.width - 4,
                wordWrap: { 
                    width: this.UsernameInput.width - 4,
                    useAdvancedWrap: true
                }
            }

        ).setOrigin(0).setTint(0x000000);
        //#endregion

        //#region Password Input Setup
        this.PasswordInput = Scene.add.rectangle(0, UsernameInputPosition.y + this.UsernameInput.height + 5, this.Width, this.Height * 0.25, 0xffffff, 1)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1)
        .setInteractive()
        .on('pointerdown', () => {
            this.Scene.sound.play('click');
            this.ActiveInput = this.PasswordValue;
            this.PasswordInput.setFillStyle(0xd1d1d1, 1);
            this.EmailInput.setFillStyle(0xffffff, 1);
            this.UsernameInput.setFillStyle(0xffffff, 1);
        });

        const PasswordInputPosition = this.PasswordInput.getTopLeft();
        this.PasswordPlaceholder = Scene.add.text(PasswordInputPosition.x + 2, PasswordInputPosition.y + 5, "Password", { fontFamily: "Mooli" }).setOrigin(0).setTint(0x000000);
        this.PasswordValue = Scene.add.text(
            this.PasswordPlaceholder.getBottomLeft().x + 2,
            this.PasswordPlaceholder.getBottomLeft().y + 4,
            "",
            {
                fontFamily: "Mooli",
                fontSize: 24,
                fixedWidth: this.PasswordInput.width - 4,
                wordWrap: { 
                    width: this.PasswordInput.width - 4,
                    useAdvancedWrap: true
                }
            }
        ).setOrigin(0).setTint(0x000000);
        //#endregion

        //#region Email Input Setup
        this.EmailInput = Scene.add.rectangle(0, this.PasswordInput.getBottomLeft().y + 5, this.Width, this.Height * 0.25, 0xffffff, 1)
        .setOrigin(0)
        .setStrokeStyle(2, 0xffffff, 1)
        .setInteractive()
        .on('pointerdown', () => {
            this.Scene.sound.play('click');
            this.ActiveInput = this.EmailValue;
            this.EmailInput.setFillStyle(0xd1d1d1, 1);
            this.PasswordInput.setFillStyle(0xffffff, 1);
            this.UsernameInput.setFillStyle(0xffffff, 1);
        });

        const EmailInputPosition = this.EmailInput.getTopLeft();
        this.EmailPlaceholder = Scene.add.text(EmailInputPosition.x + 2, EmailInputPosition.y + 5, "E-Mail", { fontFamily: "Mooli" }).setOrigin(0).setTint(0x000000);
        this.EmailValue = Scene.add.text(
            this.EmailPlaceholder.getBottomLeft().x + 2,
            this.EmailPlaceholder.getBottomLeft().y + 4,
            "",
            {
                fontFamily: "Mooli",
                fontSize: 24,
                fixedWidth: this.PasswordInput.width - 4,
                wordWrap: { 
                    width: this.PasswordInput.width - 4,
                    useAdvancedWrap: true
                }
            }
        ).setOrigin(0).setTint(0x000000);
        //#endregion
        
        this.ConfirmButton = new ModularButton(Scene, 0, EmailInputPosition.y + this.EmailInput.height + 3, this.Width, this.Height * 0.2, "Grey", "Confirm", this.AttemptRegistration.bind(this), 0);
        this.CancelButton = new ModularButton(Scene, 0, EmailInputPosition.y + this.EmailInput.height * 2 - 7, this.Width, this.Height * 0.2, "Grey", "Cancel", this.ShowLoginForm.bind(this), 0);
        
        this.Container = Scene.add.container(
            (Scene.scale.width / 2 - this.Width / 2),
            (Scene.scale.height / 2 - this.Height / 2)
        );

        this.Container.add([
            this.Background,
            this.Header,
            this.UsernameInput,
            this.UsernamePlaceholder,
            this.UsernameValue,
            this.PasswordInput,
            this.PasswordPlaceholder,
            this.PasswordValue,
            this.EmailInput,
            this.EmailPlaceholder,
            this.EmailValue,
            this.ConfirmButton,
            this.CancelButton
        ]);

        Scene.add.existing(this.Container);
        this.Container.setVisible(false);
    }

    ShowLoginForm () {
        this.ActiveInput = null;
        this.PasswordInput.setFillStyle(0xffffff, 1);
        this.UsernameInput.setFillStyle(0xffffff, 1);
        this.EmailInput.setFillStyle(0xffffff, 1);
        this.Container.setVisible(false);
        this.Scene.ActivePanel = this.Scene.LoginPanel;
        this.Scene.LoginPanel.Container.setVisible(true);
      }
    
      async AttemptRegistration (): Promise<boolean> {
    
        try {
    
          this.Container.setVisible(false);
    
          this.Scene.Message.setText("Creating account").setVisible(true);
          this.Scene.Spinner.setVisible(true);
    
          const result = await axios.post<RegisterResponse>(`${this.Scene.DataServerAddress}/create_account`, { 
            username: this.UsernameValue.text,
            password: this.PasswordValue.text,
            email: this.EmailValue.text
          });
    
          this.Scene.Spinner.setVisible(false);
          this.Container.setVisible(true);
    
          if ( result.data.success == true ) {
            this.Scene.Message.setText("Account created, you may now login").setVisible(true);
            return true;
          }
    
          throw new Error("Could not create account");
    
        } catch ( error ) {
          this.Scene.Message.setText("Could not create account").setVisible(true);
          this.Scene.Spinner.setVisible(false);
          this.Container.setVisible(true);
          return false;
        }
        
      }
  
}
