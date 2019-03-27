class ProcessBurst {
    constructor(index, color) {
        let maxXInd = PIXIStaticReference.maximumXIndex();

        this.index = index;
        let i = Math.floor(index / maxXInd);
        let j = this.index % maxXInd;
        this.left = j * BLOCK_SIZE + PADDING;
        this.top = i * BLOCK_SIZE + PADDING;
        this.width = BLOCK_SIZE;
        this.height = BLOCK_SIZE;
        this.color = color;
        this._rect = null;
        this.selected = false;
    }

    get rect() {
        if (this._rect == null) {
            this._rect = drawRectangle({
                xPos: this.left,
                yPos: this.top,
                width: this.width,
                height: this.height,
                fillColor: this.color
            });
            this._rect.width = 1;

            this._rect.interactive = true;

            this._rect.mouseover = () => {
                this.selected = true;
                this._rect.alpha = 0.5;
            };
            this._rect.mouseout = () => {
                this.selected = false;
                this._rect.alpha = 1;
            }

        }
        return this._rect;
    }

    addToCanvas() {
        let app = PIXIStaticReference.app;
        app.stage.addChild(this.rect);

        PIXIStaticReference.setAppLoop(
            // Animation Loop
            (delta) => {
                this.rect.width += BLOCK_FILL_SPEED * delta;
                if (this.rect.width >= this.width) {
                    // Disable Animation
                    PIXIStaticReference.setAppLoop(null);
                }
            }
        );
    }
}
