const BLOCK_SIZE = 50;
const PADDING = 10;
const BLOCK_FILL_SPEED = 4;
const TIME_DELAY = 1500;
const FOCUS_CHECK_DELAY = 100;

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