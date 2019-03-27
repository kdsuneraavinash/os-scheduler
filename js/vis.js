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