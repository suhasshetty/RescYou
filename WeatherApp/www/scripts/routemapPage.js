
function SearchRoute() {
    document.getElementById("MyMapLOC").style.display = 'none';

    var markers = new Array();
    var myLatLng;

    //Find the current location of the user.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            var myLatLng = new google.maps.LatLng(12.994075500000001, 77.5955017);
            var m = {};
            m.title = "Your Current Location";
            //m.lat = p.coords.latitude;
            //m.lng = p.coords.longitude;

            m.lat = 12.994075500000001;
            m.lng = 77.5955017;

            markers.push(m);

            //Find Destination address location.
            var address = "Dr Ambedkar Veedhi, Nunegundlapalli, Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru, Karnataka 560001"; //document.getElementById("txtDestination");
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    m = {};
                    m.title = address;
                    m.lat = results[0].geometry.location.lat();
                    m.lng = results[0].geometry.location.lng();
                    markers.push(m);
                    var mapOptions = {
                        center: myLatLng,
                        zoom: 4,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("MapRoute"), mapOptions);
                    var infoWindow = new google.maps.InfoWindow();
                    var lat_lng = new Array();
                    var latlngbounds = new google.maps.LatLngBounds();

                    for (i = 0; i < markers.length; i++) {
                        var data = markers[i];
                        var myLatlng = new google.maps.LatLng(data.lat, data.lng);
                        lat_lng.push(myLatlng);
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            title: data.title
                        });
                        latlngbounds.extend(marker.position);
                        (function (marker, data) {
                            google.maps.event.addListener(marker, "click", function (e) {
                                infoWindow.setContent(data.title);
                                infoWindow.open(map, marker);
                            });
                        })(marker, data);
                    }
                    map.setCenter(latlngbounds.getCenter());
                    map.fitBounds(latlngbounds);

                    //***********ROUTING****************//

                    //Initialize the Path Array.
                    var path = new google.maps.MVCArray();

                    //Getting the Direction Service.
                    var service = new google.maps.DirectionsService();

                    //Set the Path Stroke Color.
                    var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

                    //Loop and Draw Path Route between the Points on MAP.
                    for (var i = 0; i < lat_lng.length; i++) {
                        if ((i + 1) < lat_lng.length) {
                            var src = lat_lng[i];
                            var des = lat_lng[i + 1];
                            path.push(src);
                            poly.setPath(path);
                            service.route({
                                origin: src,
                                destination: des,
                                travelMode: google.maps.DirectionsTravelMode.DRIVING
                            }, function (result, status) {
                                if (status == google.maps.DirectionsStatus.OK) {
                                    for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                        path.push(result.routes[0].overview_path[i]);
                                    }
                                } else {
                                    alert("Invalid location.");
                                    window.location.href = window.location.href;
                                }
                            });
                        }
                    }
                } else {
                    alert("Request failed.")
                }
            });

        });
    }
    else {
        alert('Some Problem in getting Geo Location.');
        return;
    }
}


