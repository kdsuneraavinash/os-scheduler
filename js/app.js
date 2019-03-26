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
let canvasMode = false;
$("#play").click(function () {
    let inputForm = $("#input-form");
    let buttonPlay = $("#play");
    let buttonPlayIcon = $("#play-icon");
    let buttonPlayText = $("#play-text");
    let canvas = $("#canvas-div");

    if (canvasMode) {
        // Viewing canvas - should show inpur form
        canvas.fadeOut(200, "linear", function () {
            canvas.hide();
            inputForm.fadeIn(200, function () {
                inputForm.show();
                drawingDispose();
            })
        });
        buttonPlayText.text("Play");
    } else {
        // Viewing input form - should show canvas
        inputForm.fadeOut(200, "linear", function () {
            inputForm.hide();
            canvas.fadeIn(200, function () {
                canvas.show();
                drawingInit();
            })
        });
        buttonPlayText.text("Stop");
    }
    buttonPlay.toggleClass('btn-outline-danger');
    buttonPlay.toggleClass('btn-outline-success');
    buttonPlayIcon.toggleClass('fa-play');
    buttonPlayIcon.toggleClass('fa-square');

    canvasMode = !canvasMode;
});

// Close overlay button click
$("#close-overlay").click(function () {
    $("#mobile-block").hide();
});