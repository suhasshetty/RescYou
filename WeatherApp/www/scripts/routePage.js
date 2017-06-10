// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    var map;

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success);
        } else {
            alert("There is Some Problem on your current browser to get Geo Location!");
        }

        function success(position) {
            //var lat = position.coords.latitude;
            //var long = position.coords.longitude;
            //var city = position.coords.locality;

            var lat = 12.994026799999999;
            var long = 77.59554159999999;
            var city = "Bangalore";
          
            var LatLng = new google.maps.LatLng(lat, long);
            var mapOptions = {
                center: LatLng,
                zoom: 12,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("MyMapLOC"), mapOptions);
            var marker = new google.maps.Marker({
                position: LatLng,
                title: "<div style = 'height:60px;width:200px'><b>Your location:</b><br />Latitude: "
                + lat + +"<br />Longitude: " + long
            });

            marker.setMap(map);
            var getInfoWindow = new google.maps.InfoWindow({
                content: "<b>Your Current Location</b><br/> Latitude:" +
                lat + "<br /> Longitude:" + long + ""
            });
            getInfoWindow.open(map, marker);
        }

        //$('#send-request-btn').click(getWeatherWithZipCode);
        SearchRoute();



        $('#homelink').click(function () {
            window.location = "index.html";
        });
        $('#notificationClick').click(function () {
            window.location = "Notification.html";
        });
    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    }
} )();