class PIXIApp {
    static _app;

    static _createNewPIXIApp() {
        // Create Canvas
        let uncleDiv = $("#input-form");
        let parentDiv = $("#canvas-div");
        let app = new PIXI.Application({
            width: Math.max(uncleDiv.width(), parentDiv.width()),
            height: window.innerHeight,
            antialias: true
        });

        // Clear previous canvas and append canvas
        parentDiv.append(app.view);
        return app;
    }

    static get app() {
        if (PIXIApp._app == null) {
            PIXIApp._app = PIXIApp._createNewPIXIApp();
        }
        return PIXIApp._app;
    }

    static destroyAll() {
        PIXIApp._app = null;
    }
}
