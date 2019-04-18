//define some initial data
let tableData = [{
        id: 1,
        process_name: "Process A",
        arrival_time: "0",
        burst_time: "6",
        color: "#c62828"
    },
    {
        id: 2,
        process_name: "Process B",
        arrival_time: "1",
        burst_time: "1",
        color: "#283593"
    },
    {
        id: 3,
        process_name: "Process C",
        arrival_time: "16",
        burst_time: "8",
        color: "#2E7D32"
    },
    {
        id: 4,
        process_name: "Process D",
        arrival_time: "13",
        burst_time: "6",
        color: "#E65100"
    },
    {
        id: 5,
        process_name: "Process E",
        arrival_time: "2",
        burst_time: "5",
        color: "#FDD835"
    },
];

//create Tabulator on DOM element with id "table"
// noinspection JSUnusedGlobalSymbols
let table = new Tabulator("#table", {
    data: tableData, //assign data to table
    layout: "fitColumns", //fit columns to width of table
    selectable: true, //make rows selectable
    //Define Table Columns
    columns: [{
            title: "Name",
            field: "process_name"
        },
        {
            title: "Arrival Time",
            field: "arrival_time",
            align: "left",
        },
        {
            title: "Burst Time",
            field: "burst_time",
            align: "left",
        },
        {
            title: "Color",
            field: "color",
            formatter: function (cell) {
                //cell - the cell component
                return "<span class='rounded p-1' style='color: #fff; background-color: " + cell.getValue() + ";'>" + cell.getValue() + "</span>";
                // return "Mr" + cell.getValue(); //return the contents of the cell;
            },
            width: 120
        }
    ],
    rowSelectionChanged: function (data) {
        //update selected row counter on selection change
        let selected = "";
        if (data.length === 0) {
            selected = "No Processes selected."
        } else if (data.length === 1) {
            selected = "One Process selected."
        } else {
            selected = data.length + " Processes selected."
        }
        $("#select-stats").text(selected);
    },
});

$("#clear-button").click(function () {
    table.clearData();
});

$("#delete-button").click(function () {
    let selectedRows = table.getSelectedData();
    for (let index = 0; index < selectedRows.length; index++) {
        table.deleteRow(selectedRows[index].id);
    }
    $("#select-stats").text("No Processes selected.");
});