// Color Picker Initialization
$(document).ready(function () {
    // Color Picker
    let color = $('#color');
    color.colorpicker({
        format: 'hex',
        useAlpha: false
    });
    color.on('colorpickerChange', function (event) {
        color.css('background-color', event.color.toString());
    });
});

// Play/Stop Button Click
$("#play").click(function () {
    let inputForm = $("#input-form");
    let buttonPlay = $("#play");
    let buttonDelete = $("#delete-button");
    let buttonClear = $("#clear-button");
    let textSelectStats = $("#select-stats");
    let vis = $("#vis-div");

    // Viewing input form - should show canvas
    inputForm.fadeOut(200, "linear", function () {
        inputForm.hide();
        vis.fadeIn(200, function () {
            vis.show();
            drawingInit();
        })
    });
    table.deselectRow();
    buttonDelete.hide();
    buttonClear.hide();
    textSelectStats.hide();
    buttonPlay.hide();
});

// Close overlay button click
$("#close-overlay").click(function () {
    $("#mobile-block").hide();
});