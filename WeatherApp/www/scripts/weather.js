// Get a free key at http://openweathermap.org/. Replace the "Your_Key_Here" string with that key.
var OpenWeatherAppKey = "9b21b303a633c2bd0e86714f0ff36fff";

function getWeatherWithZipCode() {

    var zipcode = $('#zip-code-input').val();

    var queryString =
        'http://api.openweathermap.org/data/2.5/weather?zip='
         + zipcode + ',us&appid=' + OpenWeatherAppKey + '&units=imperial';

    $.getJSON(queryString, function (results) {

        showWeatherData(results);

    }).fail(function (jqXHR) {
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
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

    displayLocation(latitude, longitude);

    var queryString =
      'http://api.openweathermap.org/data/2.5/weather?lat='
        + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';

    var mymap = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: ['a', 'b', 'c']
        })
        .addTo(mymap);

    var myIcon = L.icon({
        iconUrl: 'images/pin24.png',
        iconRetinaUrl: 'images/pin48.png',
        iconSize: [29, 24],
        iconAnchor: [9, 21],
        popupAnchor: [0, -14]
    });

    L.marker([latitude, longitude], { icon: myIcon })
        .addTo(mymap)
        .bindPopup('<a href="" target="_blank"><b>Vasanth Nagar</b></a>')
        .openPopup();

    L.circle([latitude, longitude],
        200,
        {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5
        })
        .addTo(mymap)
        .bindPopup("BigRing Solutions CE.");


    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }

    mymap.on('click', onMapClick);
    
    var map = L.map('map').setView([latitude, longitude], 12);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 12
    }).addTo(map);

    $('#get-weather-btn').prop('disabled', false);

    $.getJSON(queryString, function (results) {

        showWeatherData(results);

    }).fail(function (jqXHR) {
        $('#error-msg').show();
        $('#error-msg').text("Error retrieving data. " + jqXHR.statusText);
    });

}

function showError(error) {
    var loc = document.getElementById("zip-code-input");
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

function displayLocation(latitude, longitude) {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    var loc = document.getElementById("zip-code-input");

    geocoder.geocode(
        { 'latLng': latlng },
        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add = results[0].formatted_address;
                    var value = add.split(",");

                    count = value.length;
                    country = value[count - 1];
                    state = value[count - 2];
                    city = value[count - 3];
                    loc.value = city;
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

function getAddress(latitude, longitude) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();

        var method = 'GET';
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&sensor=true';
        var async = true;

        request.open(method, url, async);
        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                if (request.status == 200) {
                    var data = JSON.parse(request.responseText);
                    var address = data.results[0];
                    resolve(address);
                }
                else {
                    reject(request.status);
                }
            }
        };
        request.send();
    });
}

function onGetLocationError(error) {

    $('#error-msg').text('Error getting location');
    $('#get-weather-btn').prop('disabled', false);
}
