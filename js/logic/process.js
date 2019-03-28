class Process {
    constructor(id, processName, arrivalTime, burstTime, color) {
        this.id = id;
        this.processName = processName;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime; // Total
        this.color = color;

        this.bursts = [];
        this.remainingTime = burstTime;
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