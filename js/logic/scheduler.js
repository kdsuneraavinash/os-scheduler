/*
-----------------------------------------------
Scheduler
-----------------------------------------------
 */

let NO_PROCESS_SCHEDULED = 1;
let SAME_PROCESS_SCHEDULED = 2;
let NO_PROCESSES_LEFT = 0;

class Scheduler {
    static roundRobinIndex = 0;

    constructor(processes, strategy) {
        this.processes = processes;
        this.blockIndex = 0;
        this.currentProcess = null;
        this.schedulingQueue = [];
        switch (strategy) {
            case "FCFS":
                this._strategy = this.firstComeFirstServe;
                break;
            case "SJF":
                this._strategy = this.shortestJobFirst;
                break;
            case "SRTF":
                this._strategy = this.shortestRemainingTimeFirst;
                break;
            case "RR":
                this._strategy = this.roundRobin;
                break;
            default:
                this._strategy = this.firstComeFirstServe;
        }
    }

    schedule() {
        let v = NO_PROCESS_SCHEDULED;
        if (currentTime === -1) {
            this.initialize();
        } else {
            v = this._strategy();
        }
        if (v !== NO_PROCESSES_LEFT) {
            currentTime++;
        }

        return v;
    }

    // ============================================================

    initialize() {
        for (let i = 0; i < this.processes.length; i++) {
            if (this.processes[i].burstTime === 0) {
                // If burst time is zero at start - remove them entirely
                this.processes.splice(i, 1);
            }
        }
    }

    endScheduling(){
        let waitiongTimeData = []
        let turnAroundTimeData = []
        this.processes.forEach(element => {
            element.computeEnd();
            let waitingTime = element.getWaitingTime();
            let turnAroundTime = element.burstTime + waitingTime;
            let color = element.color.replace('0x', '#');

            let waitiongTimeDatum = {
                'process': element.processName,
                'time': waitingTime,
                'color': color
            }
            waitiongTimeData.push(waitiongTimeDatum);

            let turnAroundTimeDatum = {
                'process': element.processName,
                'time': turnAroundTime,
                'color': color
            }
            turnAroundTimeData.push(turnAroundTimeDatum);
        });
        initTimeChart(waitiongTimeData, "chartdiv-waiting-time");
        initTimeChart(turnAroundTimeData, "chartdiv-turnaround-time");
    }

    static areProcessesExpired(scheduler) {
        let areAllExpired = true;
        for (let i = 0; i < scheduler.processes.length; i++) {
            if (scheduler.processes[i].remainingTime !== 0) {
                areAllExpired = false;
                break;
            }
        }
        return areAllExpired;
    }

    addNewArrivals() {
        // Handle New Arrivals
        for (let i = 0; i < this.processes.length; i++) {
            if (this.processes[i].arrivalTime === currentTime) {
                // If arrival time is this time - add to list
                this.schedulingQueue.push(this.processes[i]);
            }
        }
    }

    removeZeroRemainingTimeProcesses() {
        // Remove 0 remaining time processes
        for (let i = 0; i < this.schedulingQueue.length; i++) {
            if (this.schedulingQueue[i].remainingTime === 0) {
                // If burst time is zero at start - remove them entirely
                this.schedulingQueue.splice(i, 1);
            }
        }
    }

    firstComeFirstServe() {
        if (Scheduler.areProcessesExpired(this)) {
            this.endScheduling();
            return NO_PROCESSES_LEFT;
        }

        this.addNewArrivals();
        this.removeZeroRemainingTimeProcesses();

        if (this.schedulingQueue.length === 0) {
            return NO_PROCESS_SCHEDULED;
        } else {
            this.currentProcess = this.schedulingQueue[0];
            this.currentProcess.spendOneQuanta(this.blockIndex);
            this.blockIndex++;

            return SAME_PROCESS_SCHEDULED;
        }
    }

    shortestJobFirst() {
        if (Scheduler.areProcessesExpired(this)) {
            this.endScheduling();
            return NO_PROCESSES_LEFT;
        }

        this.addNewArrivals();
        this.removeZeroRemainingTimeProcesses();

        if (this.schedulingQueue.length === 0) {
            return NO_PROCESS_SCHEDULED;
        } else if (this.currentProcess === null ||
            this.currentProcess.remainingTime === 0) {

            // Select New one
            let shortestJobTime = this.schedulingQueue[0].remainingTime;
            let shortestJobI = 0;
            for (let i = 0; i < this.schedulingQueue.length; i++) {
                if (this.schedulingQueue[i].remainingTime < shortestJobTime) {
                    shortestJobTime = this.schedulingQueue[i].remainingTime;
                    shortestJobI = i;
                }
            }
            this.currentProcess = this.schedulingQueue[shortestJobI];
        }

        this.currentProcess.spendOneQuanta(this.blockIndex);
        this.blockIndex++;
        return SAME_PROCESS_SCHEDULED;
    }

    shortestRemainingTimeFirst() {
        if (Scheduler.areProcessesExpired(this)) {
            this.endScheduling();
            return NO_PROCESSES_LEFT;
        }

        this.addNewArrivals();
        this.removeZeroRemainingTimeProcesses();

        if (this.schedulingQueue.length === 0) {
            return NO_PROCESS_SCHEDULED;
        } else {
            // Select New one
            let shortestJobTime = this.schedulingQueue[0].remainingTime;
            let shortestJobI = 0;
            for (let i = 0; i < this.schedulingQueue.length; i++) {
                if (this.schedulingQueue[i].remainingTime < shortestJobTime) {
                    shortestJobTime = this.schedulingQueue[i].remainingTime;
                    shortestJobI = i;
                }
            }
            this.currentProcess = this.schedulingQueue[shortestJobI];

            this.currentProcess.spendOneQuanta(this.blockIndex);
            this.blockIndex++;

            return SAME_PROCESS_SCHEDULED;
        }
    }


    roundRobin() {
        if (Scheduler.areProcessesExpired(this)) {
            this.endScheduling();
            return NO_PROCESSES_LEFT;
        }

        this.addNewArrivals();
        this.removeZeroRemainingTimeProcesses();

        if (this.schedulingQueue.length === 0) {
            return NO_PROCESS_SCHEDULED;
        } else {
            Scheduler.roundRobinIndex = Scheduler.roundRobinIndex%this.schedulingQueue.length;
            this.currentProcess = this.schedulingQueue[Scheduler.roundRobinIndex];
            Scheduler.roundRobinIndex++;

            this.currentProcess.spendOneQuanta(this.blockIndex);
            this.blockIndex++;
            return SAME_PROCESS_SCHEDULED;
        }
    }
}