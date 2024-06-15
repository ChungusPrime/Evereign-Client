/*
A container which will show x amount of items
This list of items can be scrolled
*/

export default class ScrollableContentContainer extends Phaser.GameObjects.Container {

    // The parent element
    public Parent: any;

    // Size of this container
    public Height: number;
    public Width: number;

    // Where to start displaying the list of items from
    public ScrollOffset: number;

    // max number of items to show at once
    public ItemsToShow: number;

    constructor (Parent: any, x: number, y: number, ItemsToShow: number, Width: number = 200) {

        super (Parent.Scene, x, y);
        
        console.log(x, y);

        this.Parent = Parent;
        this.ScrollOffset = 0;
        this.ItemsToShow = ItemsToShow;
        this.Width = Width;
        
        // Enable mouse input for the container
        //this.setInteractive(new Phaser.Geom.Rectangle(x, y, 200, 200), Phaser.Geom.Rectangle.Contains);

        this.on('wheel', (pointer: any, deltaX: number, deltaY: number, deltaZ: number) => {
            console.log(pointer.x);
            if ( deltaY > 0 ) this.ScrollDown();
            if ( deltaY < 0 ) this.ScrollUp();
        });

        return this;
        
    }

    AddItem ( Item: any ) {
        Item.setPosition(this.x, this.y).setVisible(false);
        this.add(Item);
    }

    ScrollDown() {
        if ( this.ScrollOffset < this.length - this.ItemsToShow ) {
            this.ScrollOffset += 1;
            this.RefreshVisibleItems();
        }
    }

    ScrollUp () {
        if ( this.ScrollOffset > 0 ) {
            this.ScrollOffset -= 1;
            this.RefreshVisibleItems();
        }
    }

    RefreshVisibleItems () {

        const Items = this.getAll() as any[];
        console.log(Items);
        const ItemsCount = Items.length;

        // Hide All Items
        Items.forEach( (item: any) => {
            item.setVisible(false);
        });

        let Counter = 0;
        let y = 0;

        for ( let i = this.ScrollOffset; i < this.ItemsToShow + this.ScrollOffset; i++ ) {

            const element = Items[i];

            if ( Counter == 0 )
                y += this.y + 2;
            else
                y += element.height + 2;

            Items[i].setPosition(2, y).setVisible(true);
            Counter++;

        }

    }

}