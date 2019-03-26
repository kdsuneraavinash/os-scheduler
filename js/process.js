const BLOCK_SIZE = 50;
const PADDING = 10;
const BLOCK_FILL_SPEED = 4;
const TIME_DELAY = 1500;
const FOCUS_CHECK_DELAY = 100;
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
Aliases
-----------------------------------------------
 */

let PIXIApplication = PIXI.Application;
let PIXIWebGLSupport = PIXI.utils.isWebGLSupported;
let PIXIGraphics = PIXI.Graphics;

function valueWithDefault(value, defaultValue) {
    return (value === undefined) ? defaultValue : value;
}

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


/*
-----------------------------------------------
PIXI Drawing Functions
-----------------------------------------------
 */

function drawRectangle(options) {
    let xPos = valueWithDefault(options['xPos'], 0);
    let yPos = valueWithDefault(options['yPos'], 0);
    let width = valueWithDefault(options['width'], 64);
    let height = valueWithDefault(options['height'], 64);
    let fillColor = valueWithDefault(options['fillColor'], 0x66CCFF);
    let lineColor = valueWithDefault(options['lineColor'], 0x000000);
    let lineWidth = valueWithDefault(options['lineWidth'], 1);
    let lineAlpha = valueWithDefault(options['lineAlpha'], 1);

    let rectangle = new PIXIGraphics();
    rectangle.lineStyle(lineWidth, lineColor, lineAlpha);
    rectangle.beginFill(fillColor);
    rectangle.drawRect(xPos, yPos, width, height);
    rectangle.endFill();
    return rectangle;
}

/*
------------------------------------
Guntt Chart Process
------------------------------------
*/
class Process {
    constructor(id, processName, arrivalTime, burstTime, color) {
        this.bursts = [];
        // this.id = id;
        this.processName = processName;
        this.arrivalTime = arrivalTime;
        // this.burstTime = burstTime;
        this.color = color;
        this.remainingTime = burstTime;
    }

    addNewPart(time) {
        if (this.remainingTime === 0) {
            return false;
        }
        let g = new ProcessBurst(time, this.color);
        g.addToCanvas();
        this.bursts.push(g);
        this.remainingTime--;
        return true;
    }

    static fromJSON(json) {
        let color = json['color'];
        color = "0x" + color.substr(1);
        return new Process(json['id'], json['process_name'],
            json['arrival_time'],
            json['burst_time'], color)
    }
}

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

function createProcessArrayFromData() {
    let rawData = table.getData();
    let processes = [];
    for (let i = 0; i < rawData.length; i++) {
        processes.push(Process.fromJSON(rawData[i]));
    }
    return processes;
}

/*
-----------------------------------------------
Scheduler
-----------------------------------------------
 */

class Scheduler {
    constructor(processes, strategy) {
        this.processes = processes;
        this.blockIndex = 0;
        this.time = -1;
        this.currentProcess = null;
        this.processQueue = null;
        switch (strategy) {
            case "FIFO":
                this._strategy = this.firstComeFirstServe;
                break;
            case "SJF":
                this._strategy = this.shortestJobFirst;
                break;
            case "SRTF":
                this._strategy = this.shortestRemainingTimeFirst;
                break;
            default:
                this._strategy  = this.firstComeFirstServe;
        }
    }

    schedule() {
        let v = this._strategy();
        this.time++;
        return v;
    }

    firstComeFirstServe() {
        if (this.processQueue == null) {
            // initial run - sort by arrivalTime
            this.processQueue = this.processes;
            this.processQueue.sort(function (a, b) {
                return a.arrivalTime - b.arrivalTime
            });
        }

        if (this.currentProcess == null) {
            if (this.processQueue.length === 0) {
                console.log("No Processes");
                // No processes left
                return false;
            }
            // Context Switching
            // First process
            console.log("Context Switching");
            this.currentProcess = this.processQueue.shift();
            return true;
        }

        let partAdded = this.currentProcess.addNewPart(this.blockIndex);
        if (!partAdded) {
            // Process has expired
            this.currentProcess = null;
            return this.firstComeFirstServe();
        } else {
            this.blockIndex++;
        }
        return true;
    }

    shortestRemainingTimeFirst() {
        let firstTime = false;
        if (this.processQueue == null) {
            // initial run
            firstTime = true;
            this.processQueue = this.processes;

        }

        this.processQueue.sort(function (a, b) {
            return a.remainingTime - b.remainingTime
        });

        console.log(this.processQueue);

        if (this.currentProcess == null) {
            if (!firstTime){
                this.processQueue.shift();
            }

            if (this.processQueue.length === 0) {
                console.log("No Processes");
                // No processes left
                return false;
            }
        }

        this.currentProcess = this.processQueue[0];

        let partAdded = this.currentProcess.addNewPart(this.blockIndex);
        if (!partAdded) {
            // Process has expired
            this.currentProcess = null;
            return this.shortestRemainingTimeFirst();
        } else {
            this.blockIndex++;
        }
        return true;
    }

    shortestJobFirst() {
        if (this.processQueue == null) {
            // initial run - sort by burst time
            this.processQueue = this.processes;
            this.processQueue.sort(function (a, b) {
                return a.remainingTime - b.remainingTime
            });
        }

        if (this.currentProcess == null) {
            if (this.processQueue.length === 0) {
                console.log("No Processes");
                // No processes left
                return false;
            }
            // Context Switching
            // First process
            console.log("Context Switching");
            this.currentProcess = this.processQueue.shift();
            return true;
        }

        let partAdded = this.currentProcess.addNewPart(this.blockIndex);
        if (!partAdded) {
            // Process has expired
            this.currentProcess = null;
            return this.shortestJobFirst();
        } else {
            this.blockIndex++;
        }
        return true;
    }
}

/*
-----------------------------------------------
Focus Unfocus detector
-----------------------------------------------
 */
let focused = true;
let isNotRunning = false;

window.onfocus = function () {
    focused = true;
};
window.onblur = function () {
    focused = false;
};


/*
-----------------------------------------------
Main
-----------------------------------------------
 */
function drawingInit() {
    isNotRunning = false;
    let app = PIXIStaticReference.app;

    app.ticker.add(delta => PIXIStaticReference.appLoop(delta));
    app.renderer.backgroundColor = 0x061639;
    PIXIStaticReference.timeText.draw();
    PIXIStaticReference.currentProcessText.draw();

    let processes = createProcessArrayFromData();
    let scheduler = new Scheduler(processes, "SRTF");
    loop(scheduler);
}

function drawingDispose() {
    PIXIStaticReference.destroyAll();
    $("#canvas-div").empty();
    isNotRunning = true;
}

function loop(scheduler) {
    let v = scheduler.schedule();
    PIXIStaticReference.timeText.update(scheduler.blockIndex);
    PIXIStaticReference.currentProcessText.update(scheduler.currentProcess.processName);

    timeout(TIME_DELAY).then(
        function () {
            if (v) {
                scheduleAfterGetFocus(scheduler)
            }
        }
    )
}

function scheduleAfterGetFocus(scheduler) {
    timeout(FOCUS_CHECK_DELAY).then(
        function () {
            if (isNotRunning) {
            } else if (focused) {
                loop(scheduler);
            } else {
                scheduleAfterGetFocus(scheduler);
            }
        }
    )
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}