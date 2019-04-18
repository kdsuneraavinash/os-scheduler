/*
-----------------------------------------------
Main
-----------------------------------------------
 */
currentTime = -1;

function drawingInit() {
    isNotRunning = false;
    let app = PIXIApp.app;

    // app.ticker.add(delta => PIXIApp.appLoop(delta));
    app.renderer.backgroundColor = 0x061639;

    let processes = createProcessArrayFromData();
    let scheduler = new Scheduler(processes, $('#algorithm').val());
    // noinspection JSIgnoredPromiseFromCall
    draw(scheduler);
}

async function draw(scheduler) {
    while (true) {
        let v = loop(scheduler);
        await timeout(TIME_DELAY);
        if (!v) break;
    }

    let data = [];
    for (let i = 0; i < scheduler.processes.length; i++) {
        let process = scheduler.processes[i];
        for (let j = 0; j < process.bursts.length; j++) {
            let burst = process.bursts[j];
            let datum = {
                name: process.processName,
                start: (burst.time) + '',
                end: (burst.time + 1) + '',
                color: process.color.replace('0x', '#')
            };
            data.push(datum);
        }
    }

    // initWaitingTime();
    initChart(data);
    $("#chart-button").show();
}

function loop(scheduler) {
    let v = scheduler.schedule();
    /**
     * 0 = No Processes left
     * 1 = No process available (No arrived)
     * 2 = Process Available
     * 3 = No process available (Just Started)
     */

    $("#current-time").text(currentTime);
    if (v === NO_PROCESSES_LEFT) {
        $("#scheduler-message").text("Simulation Ended");
        return false; // No Processes Left
    }else if (v === NO_PROCESS_SCHEDULED){
        $("#scheduler-message").text("Simulating...");
        $("#current-process").text("No Process");
        let progress = $("#current-process-progress");
        progress.text('No Scheduled Process');
        progress.css('width', '0%');
    } else if (scheduler.currentProcess) {
        $("#current-process").text(scheduler.currentProcess.processName);
        let progress = $("#current-process-progress");
        let currentProcessObj = scheduler.currentProcess;
        progress.text('Burst ' + (currentProcessObj.burstTime - currentProcessObj.remainingTime) + '/'
            + currentProcessObj.burstTime);
        progress.css('background-color', currentProcessObj.color.replace('0x', '#'));
        progress.css('width', (100 * (1 - currentProcessObj.remainingTime / currentProcessObj.burstTime)) + '%');
    }

    return true;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}