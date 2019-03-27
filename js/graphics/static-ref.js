const TIME_TEXT_STYLE = {
    fontSize: 60,
    fontFamily: 'Bungee Inline',
    fill: '#ffffff',
    align: 'center',
    stroke: '#78909C',
    strokeThickness: 7,
    letterSpacing: 6
};

const PROCESS_TEXT_STYLE = {
    fontSize: 36,
    fill: ['#ffffff', '#00ff99'],
    fontFamily: 'Monoton'
};

/*
-----------------------------------------------
PIXI Canvas
-----------------------------------------------
*/
function getPIXI() {
    // Initialize PIXI
    let type = "WebGL";
    if (!PIXIWebGLSupport()) {
        type = "canvas"
    }
    PIXI.utils.sayHello(type);

    // Create Canvas
    let uncleDiv = $("#input-form");
    let parentDiv = $("#canvas-div");
    let app = new PIXIApplication({
        width: Math.max(uncleDiv.width(), parentDiv.width()),
        height: window.innerHeight,
        antialias: true
    });

    // Clear previous canvas and append canvas
    parentDiv.append(app.view);
    return app;
}

class PIXIStaticReference {
    static _app;
    static _appLoop;
    static _timeText;
    static _currentProcessText;

    static maximumXIndex() {
        return Math.floor(PIXIStaticReference.app.view.width / BLOCK_SIZE) - 1;
    }

    static get app() {
        if (PIXIStaticReference._app == null) {
            PIXIStaticReference._app = getPIXI();
        }
        return PIXIStaticReference._app;
    }

    static get appLoop() {
        if (PIXIStaticReference._appLoop == null) {
            PIXIStaticReference._appLoop = (ignored) => null;
        }
        return PIXIStaticReference._appLoop;
    }

    static get timeText() {
        if (PIXIStaticReference._timeText == null) {
            PIXIStaticReference._timeText = new PIXIText(
                "0",
                TIME_TEXT_STYLE,
                PIXIStaticReference.app.screen.width / 2,
                PIXIStaticReference.app.screen.height / 2);
        }
        return PIXIStaticReference._timeText;
    }

    static get currentProcessText() {
        if (PIXIStaticReference._currentProcessText == null) {
            PIXIStaticReference._currentProcessText = new PIXIText(
                "[None]",
                PROCESS_TEXT_STYLE,
                PIXIStaticReference.app.screen.width / 2,
                PIXIStaticReference.app.screen.height / 2 + 100);
        }
        return PIXIStaticReference._currentProcessText;
    }

    static setAppLoop(func) {
        PIXIStaticReference._appLoop = func;
    }

    static destroyAll() {
        PIXIStaticReference._app = null;
        PIXIStaticReference._appLoop = null;
        PIXIStaticReference._timeText = null;
        PIXIStaticReference._currentProcessText = null;
    }
}
