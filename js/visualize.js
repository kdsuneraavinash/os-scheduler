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

async function draw(scheduler){
    while (true){
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
    initChart(data);
    $("#chart-button").show();
}

function loop(scheduler)  {
    let v = scheduler.schedule();
    /**
     * 0 = No Processes left
     * 1 = No process available (No arrived)
     * 2 = Process Available
     * 3 = No process available (Just Started)
     */

    if (v === 0){
        return false; // No Processes Left
    }
    if (v === 1 || v === 3) currentTime++; // Increase time and continue
    $("#current-time").text(currentTime);


    if (v === 1 || v === 2){
        $("#current-process").text(scheduler.currentProcess.processName);
        let progress = $("#current-process-progress");
        let currentProcessObj = scheduler.currentProcess;
        progress.text('Burst ' + (currentProcessObj.burstTime - currentProcessObj.remainingTime) + '/'
            + currentProcessObj.burstTime);
        progress.css('background-color', currentProcessObj.color.replace('0x', '#'));
        progress.css('width', (100*(1 -currentProcessObj.remainingTime/ currentProcessObj.burstTime)) + '%');
    }

    return true;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}