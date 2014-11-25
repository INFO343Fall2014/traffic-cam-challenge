// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
   var mapElem = document.getElementById('map');
   var center = {
       lat: 47.6,
       //Center Latitude of map
       lng: -122.3
       //Center Longitude of map
   };

   var map = new google.maps.Map(mapElem, {
   	//Zoom map is 12
       center: center,
       zoom: 12
   });


   var infoWindow = new google.maps.InfoWindow();
   //google.maps.InfoWindow object allow use to show the traffic camera image when the user clicks on the cam marker

   var traffics;
   var markers = [];

   $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
   //getJSON opens up a array 
   //insert http://data.seattle.gov/resource/65fc-btcc.json into $.getJSON
       .done (function(data) {
            traffics = data;
            data.forEach(function(traffic, itemIndex) {
                var marker = new google.maps.Marker ({
                	cameraLabel: traffic.cameralabel,
                    position: {
                        lat: Number(traffic.location.latitude),
                        lng: Number(traffic.location.longitude)
                    },
                    map: map
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                	var getPosition = this.getPosition();
                	map.panTo(getPosition);
                	//When click event occurs, Google Maps will follow to the location
                	//The marker object has a method called getPosition that return a LatLng object to represent the latitude and longitude

                    var html = '<h3>' + traffic.cameralabel + '</h3>';
                    //created a new header called traddic.cameralabel
                    html += '<img src="' + traffic.imageurl.url + '" alt="trafficjam">'

                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                });
            });
       })
       .fail (function(error) {
           console.log(error)
           alert("Unavailable to retrieve data");
       })
       .always(function() {
            $('#ajax-loader').fadeOut();
       });

       $('#search').bind('search keyup', function(){
       	var searchinput = $('#search').val()
       	searchinput = searchinput.toLowerCase();
       	var idx;
       	for (idx = 0; idx < markers.length; idx++) {
       		var marker = markers[idx];
       		var trafficCam = marker.cameraLabel;
       		trafficCam = trafficCam.toLowerCase();
       	



       		if (!trafficCam.contains(searchinput)) {
       			marker.setMap(null);
       		} else {
       			marker.setMap(map);
       		}
       	}
       });


});
