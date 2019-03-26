'use strict';

/// Validate forms in the page
$(document).ready(function () {
    let forms = $('.needs-validation');

    let process_name = $("#process_name");
    let arrival_time = $("#arrival_time");
    let burst_time = $("#burst_time");
    let color = $("#color");

    process_name.on("input", function () {
        validateNotEmpty(process_name);
    });
    arrival_time.on("input", function () {
        validateNotEmptyAndNumber(arrival_time);
    });
    burst_time.on("input", function () {
        validateNotEmptyAndNumber(burst_time);
    });

    Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function () {
            if (validateNotEmpty(process_name) &&
                validateNotEmptyAndNumber(arrival_time) &&
                validateNotEmptyAndNumber(burst_time)) {

                // Validated
                event.preventDefault();
                event.stopPropagation();

                // Add Data to table - false to add data to end of table
                table.addData([{
                    id: table.getData().length + 1,
                    process_name: process_name.val(),
                    arrival_time: arrival_time.val(),
                    burst_time: burst_time.val(),
                    color: color.val()
                }], false);

                process_name.removeClass('is-valid');
                arrival_time.removeClass('is-valid');
                burst_time.removeClass('is-valid');
                color.removeClass('is-valid');

                process_name.val("");
                arrival_time.val("");
                burst_time.val("");
                color.val("rgb(255, 255, 255)");

                color.css('background-color', 'white');

            }
        }, false);
    });
});

function checkField(field, conditions) {
    field.removeClass("is-valid");
    field.removeClass("is-invalid");
    if (conditions) {
        field.addClass("is-valid");
        return true;
    } else {
        field.addClass("is-invalid");
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
}

function validateNotEmpty(field) {
    return checkField(field, field.val() !== "");
}

function validateNotEmptyAndNumber(field) {
    return checkField(field, field.val() !== "" &&
        jQuery.isNumeric(field.val()) &&
        Math.floor(field.val()).toString() === field.val());
}
