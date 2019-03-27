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