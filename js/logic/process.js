class Process {
    constructor(id, processName, arrivalTime, burstTime, color) {
        this.processName = processName;
        this.arrivalTime = parseInt(arrivalTime);
        this.burstTime = parseInt(burstTime); // Total
        this.endTime = null

        this.color = color;

        this.bursts = [];
        this.remainingTime = this.burstTime;
    }

    getWaitingTime(){
        /// TOTAL_RUNNING_TIME - TIME_ACTUALLY_SPENT_RUNNING
        /// = (END_TIME - ARRIVAL_TIME + 1) - BURST_TIME
        return this.endTime - this.arrivalTime + 1 - this.burstTime;
    }

    computeEnd(){
        /// END_TIME = LAST_BURST_TIME
        this.endTime = this.bursts[this.bursts.length - 1].time;
    }

    spendOneQuanta(){
        if (this.remainingTime === 0) {
            return false;
        }
        let g = new ProcessBurst(this.color, this.bursts.length, this);
        g.drawOnStage();
        this.bursts.push(g);
        this.remainingTime--;
        return true;
    }

    static fromJSON(json) {
        let color = json['color'];
        color = "0x" + color.substr(1);
        return new Process(
            json['id'],
            json['process_name'],
            json['arrival_time'],
            json['burst_time'],
            color)
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