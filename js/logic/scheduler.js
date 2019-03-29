/*
-----------------------------------------------
Scheduler
-----------------------------------------------
 */

class Scheduler {
    static roundRobinIndex = 0;

    constructor(processes, strategy) {
        this.processes = processes;
        this.blockIndex = 0;
        this.time = -1;
        this.currentProcess = null;
        this.processQueue = null;
        switch (strategy) {
            case "FCFS":
                this._strategy = Scheduler.firstComeFirstServe;
                this._process = this.nonPreemptive;
                break;
            case "SJF":
                this._strategy = Scheduler.shortestJobFirst;
                this._process = this.nonPreemptive;
                break;
            case "SRTF":
                this._strategy = Scheduler.shortestJobFirst;
                this._process = this.preemptive;
                break;
            case "RR":
                this._strategy = Scheduler.roundRobin;
                this._process = this.preemptive;
                break;
            default:
                this._process = this.nonPreemptive;
                this._strategy = Scheduler.firstComeFirstServe;
        }
        console.log(this._strategy)
    }

    static isAllProcessesExpired(scheduler){
        let isAllExpired = true;
        for (let i = 0; i < scheduler.processQueue.length; i++) {
            if (scheduler.processQueue[i].remainingTime !== 0) {
                isAllExpired = false;
                break;
            }
        }
        return isAllExpired;
    }

    schedule() {
        let v = this._process(this._strategy);
        this.time++;
        return v;
    }

    nonPreemptive(selectNext) {
        let schedulerMessage = $('#scheduler-message');

        if (this.processQueue == null) {
            // initial run
            this.processQueue = this.processes;
        }

        if (this.currentProcess === null) {
            // First Time
            let v = selectNext(this);
            if (v === 1) {
                return 3
            } else {
                return v;
            }
        }

        if (this.currentProcess.remainingTime === 0) {
            schedulerMessage.text('Waiting...');
            let v = selectNext(this);
            if (v === 0) {
                schedulerMessage.text('No Processes Left');
                return 0;
            }
            return v;
        }

        this.currentProcess.spendOneQuanta(this.blockIndex);
        this.blockIndex++;
        schedulerMessage.text('Scheduling...');
        return 1; // return selectNext(this)
    }

    preemptive(selectNext) {
        let schedulerMessage = $('#scheduler-message');

        if (this.processQueue == null) {
            // initial run
            this.processQueue = this.processes;
        }

        if (this.currentProcess === null) {
            // First Time
            let v = selectNext(this);
            if (v === 1) {
                return 3
            } else {
                return v;
            }
        }

        let v = selectNext(this);
        if (v === 0) {
            schedulerMessage.text('No Processes Left');
            return 0;
        } else if (v === 1) {
            schedulerMessage.text('Waiting...');
            return 1;
        }
        this.currentProcess.spendOneQuanta(this.blockIndex);
        this.blockIndex++;
        schedulerMessage.text('Scheduling...');
        return 1;
    }

    // LOGIC IMPLEMENTATIONS =======================================

    static firstComeFirstServe(scheduler) {
        scheduler.processQueue.sort(function (a, b) {
            return a.arrivalTime - b.arrivalTime
        });

        if(Scheduler.isAllProcessesExpired(scheduler)){
            return 0;
        }

        for (let i = 0; i < scheduler.processQueue.length; i++) {
            if (scheduler.processQueue[i].arrivalTime <= currentTime) {
                if (scheduler.processQueue[i].remainingTime === 0) continue;
                scheduler.currentProcess = scheduler.processQueue[i];
                // scheduler.processQueue.splice(i, 1);
                $('#scheduler-message').text('Context Switching');
                return 2; // Available
            }
        }
        return 1; // Not available
    }

    static shortestJobFirst(scheduler) {
        scheduler.processQueue.sort(function (a, b) {
            return a.remainingTime - b.remainingTime
        });

        if(Scheduler.isAllProcessesExpired(scheduler)){
            return 0;
        }

        for (let i = 0; i < scheduler.processQueue.length; i++) {
            if (scheduler.processQueue[i].arrivalTime <= currentTime) {
                if (scheduler.processQueue[i].remainingTime === 0) continue;
                scheduler.currentProcess = scheduler.processQueue[i];
                // scheduler.processQueue.splice(i, 1);
                $('#scheduler-message').text('Context Switching');
                return 2; // Available
            }
        }
        return 1; // Not available
    }

    static roundRobin(scheduler) {
        scheduler.processQueue.sort(function (a, b) {
            return ('' + a.processName).localeCompare(b.processName);
        });

        if(Scheduler.isAllProcessesExpired(scheduler)){
            return 0;
        }

        for (let i = 1; i <= scheduler.processQueue.length; i++) {
            let j = (i + Scheduler.roundRobinIndex) % scheduler.processQueue.length;

            if (scheduler.processQueue[j].arrivalTime <= currentTime) {
                if (scheduler.processQueue[j].remainingTime === 0) continue;
                scheduler.currentProcess = scheduler.processQueue[j];
                $('#scheduler-message').text('Context Switching');
                Scheduler.roundRobinIndex = j;
                return 2; // Available
            }
        }
        return 1; // Not available
    }
}