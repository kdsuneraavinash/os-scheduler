class ProcessBurst {
    static activeMouseHover = '';

    constructor(color, burstIndex, parent) {
        this.color = color;
        this.burstIndex = burstIndex;
        this.parentProcess = parent;

        this.width = BLOCK_SIZE;
        this.height = BLOCK_SIZE;

        let maxXInd = Math.floor(PIXIApp.app.view.width / BLOCK_SIZE) - 1;
        this.time = currentTime;

        let i = Math.floor(this.time / maxXInd);
        let j = this.time % maxXInd;
        this.left = j * BLOCK_SIZE + PADDING;
        this.top = i * BLOCK_SIZE + PADDING;

        this._rect = null;
    }

    _createRect(){
        let rect = drawRectangle({
            xPos: this.left,
            yPos: this.top,
            width: this.width,
            height: this.height,
            fillColor: this.color
        });
        // rect.width = 1;

        rect.interactive = true;
        let mouseText = 'Burst ' + (this.burstIndex + 1) + ' of ' + this.parentProcess.processName;
        mouseText += "<br/>Burst happened at t = "+ this.time;
        let mouseTextLabel = $('#mouse-text');

        // noinspection JSUndefinedPropertyAssignment
        rect.mouseover = () => {
            mouseTextLabel.html(mouseText);
            ProcessBurst.activeMouseHover = this.burstIndex + ':' + this.parentProcess.processName;
            ProcessBurst.activeMouseHover = mouseText;
            rect.alpha = 0.5;
        };
        // noinspection JSUndefinedPropertyAssignment
        rect.mouseout = () => {
            if (ProcessBurst.activeMouseHover === mouseText){
                mouseTextLabel.html('[Hover mouse over a burst block to see details]');
                ProcessBurst.activeMouseHover = '';
            }
            rect.alpha = 1;
        };

        this._rect = rect;
    }

    get rect() {
        if (this._rect == null) {
            this._createRect();
        }
        return this._rect;
    }

    drawOnStage() {
        let app = PIXIApp.app;
        this.rect.alpha = 0;
        app.stage.addChild(this.rect);
        let animation = (delta) => {
            if (this.rect.alpha >= 1) return;
            this.rect.alpha += (ALPHA_FILL_RATE * delta);
        }
        app.ticker.add(animation);
        setTimeout(() => {
            app.ticker.remove(animation);
        }, TIME_DELAY);
    }
}
