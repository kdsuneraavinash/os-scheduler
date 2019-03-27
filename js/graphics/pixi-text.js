class PIXIText {
    constructor(initialText, style, x, y) {
        this.text = new PIXI.Text(initialText, style);
        this.text.x = x;
        this.text.y = y;

    }

    draw() {
        this.text.anchor.x = 0.5;
        PIXIStaticReference.app.stage.addChild(this.text);
    }

    // noinspection JSUnusedGlobalSymbols
    update(text) {
        if (text != null) {
            this.text.text = text;
        }
    }
}