
function getWeatherWithZipCode() {

    var autoComplete = $('#pac-input-location');


    var dataObj = {
        Lat: autoComplete.attr("lat"), Lang: autoComplete.attr("lang"), ReporterID: 1,
        VictimCategory: true, Summary: $("#incident-code-summary").val(), IsRescued: false, PriorityLevel: 1
    };
    $.post({
        url: "http://35.162.30.8/rescueapi/api/Common/incident",
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

function showWeatherData(results) {

    if (results.weather.length) {

        $('#error-msg').hide();
        $('#weather-data').show();

        $('#title').text(results.name);
        $('#temperature').text(results.main.temp);
        $('#wind').text(results.wind.speed);
        $('#humidity').text(results.main.humidity);
        $('#visibility').text(results.weather[0].main);

        var sunriseDate = new Date(results.sys.sunrise * 1000);
        $('#sunrise').text(sunriseDate.toLocaleTimeString());

        var sunsetDate = new Date(results.sys.sunset * 1000);
        $('#sunset').text(sunsetDate.toLocaleTimeString());

    } else {
        $('#weather-data').hide();
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. ");
    }
}

function getWeatherWithGeoLocation() {

    navigator.geolocation.getCurrentPosition(onGetLocationSuccess, onGetLocationError,
        {
            enableHighAccuracy: true
        });

    $('#error-msg').show();
    $('#error-msg').text('Determining your current location ...');

    $('#get-weather-btn').prop('disabled', true);
}
function onGetLocationSuccess(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    initMap(latitude, longitude);
    displayLocation(latitude, longitude);
}

function showError(error) {
    var loc = document.getElementById("pac-input-location");
    switch (error.code) {
        case error.PERMISSION_DENIED:
            loc.value = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            loc.value = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            loc.value = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            loc.value = "An unknown error occurred.";
            break;
    }
}

var map;
var markers = [];


// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}


function initMap(latitude, longitude) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 13
    });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input-location');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

   
    addMarker({ lat: latitude, lng: longitude });


    addYourLocationButton(map);
    
    google.maps.event.addListener(map, 'click', function (event) {
        deleteMarkers();
        addMarker({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        $("#pac-input-location").attr("lat", event.latLng.lat());
        $("#pac-input-location").attr("lang", event.latLng.lng());
        displayLocation(event.latLng.lat(), event.latLng.lng());
        //alert("Latitude: " + event.latLng.lat() + " " + ", longitude: " + event.latLng.lng());
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        $("#pac-input-location").attr("lat", place.geometry.location.lat());
        $("#pac-input-location").attr("lang", place.geometry.location.lng());


        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);
    });

}

function addYourLocationButton(map) {
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-2x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0 0';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'center_changed', function () {
        secondChild.style['background-position'] = '0 0';
    });

    firstChild.addEventListener('click', function () {
        var imgX = '0',
            animationInterval = setInterval(function () {
                imgX = imgX === '-18' ? '0' : '-18';
                secondChild.style['background-position'] = imgX + 'px 0';
            }, 500);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(latlng);
                clearInterval(animationInterval);
                deleteMarkers();
                secondChild.style['background-position'] = '-144px 0';
                addMarker({ lat: position.coords.latitude, lng: position.coords.longitude });
                $("#pac-input-location").attr("lat", position.coords.latitude);
                $("#pac-input-location").attr("lang", position.coords.longitude);
            });
        } else {
            clearInterval(animationInterval);
            secondChild.style['background-position'] = '0 0';
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function displayLocation(latitude, longitude) {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    var loc = document.getElementById("pac-input-location");

    $("#pac-input-location").attr("lat", latitude);
    $("#pac-input-location").attr("lang", longitude);


    geocoder.geocode(
        { 'latLng': latlng },
        function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add = results[0].formatted_address;
                    var value = add.split(",");

                    count = value.length;
                    country = value[count - 1];
                    state = value[count - 2];
                    city = value[count - 3];
                    loc.value = add;
                }
                else {
                    loc.value = "address not found";
                }
            }
            else {
                loc.value = "Geocoder failed due to: " + status;
            }
        }
    );
}

function onGetLocationError(error) {

    $('#error-msg').text('Error getting location');
    $('#get-weather-btn').prop('disabled', false);
}
