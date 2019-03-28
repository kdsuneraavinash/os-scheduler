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

    let rectangle = new PIXI.Graphics();
    rectangle.lineStyle(lineWidth, lineColor, lineAlpha);
    rectangle.beginFill(fillColor);
    rectangle.drawRect(xPos, yPos, width, height);
    rectangle.endFill();
    return rectangle;
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