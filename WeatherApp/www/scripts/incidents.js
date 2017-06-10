var apiBaseURL = "http://35.162.30.8/rescueapi/api/Common";

function getWeatherWithZipCode() {

    var zipcode = $('#zip-code-input').val();


    var dataObj = {
        Lat: $('#zip-code-input').attr("lat"), Lang: $('#zip-code-input').attr("lang"), ReporterID: 1,
        VictimCategory: true, Summary: $("#incident-code-summary").value(), IsRescued: false, PriorityLevel: 1
    };
    $.post({
        url: apiBaseURL,
        type: "POST",
        data: dataObj,
        success: function (e) {
            if (e.Response !== null) {
                console.log(e.Response);
            }
        },
        error: function (e, o, t) {
            console.log(e, o, t);
        }
    });

    return false;
}

function routeMapPage() {
    $(".routemap-id").click(function (e) {
        window.location = "routemap.html";
    });
}


function getAllIncidents() {

    var html = '';
    var info = { data: [{ title: "Metting 1", timing: "timing"}]};
    for (var count = 0; count < info.data.length; count++) {
        html = html + "<tr data-id='1' class='routemap-id'><td>" + info.data[count]["title"] + "</td><td>" + info.data[count]["timing"] + "</td></tr>";
    }

    $("table#allTable tbody").empty();
    $("table#allTable tbody").append(html).closest("table#allTable").table("refresh").trigger("create");  
    routeMapPage();
}



