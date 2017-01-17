    var map;
    var marker;
    var map_marker= {};
    var directionsDisplay;
    var f;

/*http://serverfault.com/questions/714534/heroku-error-r14-memory-quota-exceeded-using-node-js*/
/*********************************************************************************************************************************/ 

function getPos(f){
   // alert("hey baby");
   console.log("inside getPos method...");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
           if(f==="updateMarker"){
            //console.log("Update Marker called...");
            redraw(JSON.parse(xhttp.responseText));
           }
           else
            loadMap(JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", "api/getDevicePos", true);
    xhttp.send();
}

/*********************************************************************************************************************************/

function getLocal() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var locationMarker = null;
            if (locationMarker) {
                return;
            }
            lat = position.coords["latitude"];
            lng = position.coords["longitude"];
            console.log("Brijesh");
            //console.log(lat, lng);
            var res = getPos();
            console.log(res);
            loadMap(res);
        }, function(error) {
           // console.log("Error: ", error);
        }, {
            enableHighAccuracy: true
        });
    }
}

/*********************************************************************************************************************************/

function Icon(deg) {
    return {
        path: "M 76.902344 0.00390625 C 75.488281 0.011474612 74.075391 0.030468745 72.666016 0.05859375 C 58.353516 -0.11640629 43.278912 -0.27851569 30.066406 6.0214844 C 22.978906 9.2839844 18.103906 16.071094 16.316406 23.558594 C 18.966406 19.383594 21.341406 14.483594 26.066406 12.308594 C 31.203906 9.9710941 36.716797 8.5722656 42.279297 7.6972656 C 40.779297 8.8847656 39.253516 10.047656 37.666016 11.097656 C 33.878509 13.672656 30.078906 16.221875 26.378906 18.921875 C 23.772656 20.76875 21.026172 22.398438 18.191406 23.851562 C 17.246484 24.335938 16.290625 24.799219 15.328125 25.246094 C 13.053125 32.133594 11.703516 39.283984 10.728516 46.458984 C 8.0410156 67.758984 7.253125 89.247266 6.890625 110.69727 C 5.353125 110.88477 3.8167969 111.05938 2.2792969 111.23438 C 1.1667969 113.24688 -0.42148437 115.23398 0.10351562 117.70898 C 0.028515625 121.17148 3.703125 122.43398 6.453125 123.08398 C 6.278125 140.83399 6.7660156 158.58477 6.0410156 176.32227 C 6.0285156 205.07227 6.0542969 233.83516 6.0292969 262.59766 C 6.5667969 273.82266 5.8402344 285.24609 8.5527344 296.24609 C 9.5402344 300.92109 12.553516 305.07187 16.791016 307.29688 C 29.078516 314.62188 43.778125 315.12227 57.640625 316.32227 C 66.003125 316.57227 74.427734 318.48398 82.740234 316.70898 C 97.940234 314.83398 114.49062 315.20938 127.70312 306.29688 C 134.70312 301.79688 135.26641 292.67227 136.06641 285.19727 C 137.19141 266.43477 136.84102 247.62266 136.72852 228.84766 C 136.72852 193.58516 136.94023 158.3086 136.42773 123.05859 C 138.55273 122.30859 141.30312 122.09766 142.39062 119.78516 C 142.77812 117.72266 142.77891 115.63359 142.94141 113.55859 C 141.01641 112.03359 138.77812 111.04727 136.39062 110.44727 C 135.21562 86.897266 135.1543 63.208984 131.2168 39.896484 C 129.7168 31.233984 127.5793 22.433984 122.9043 14.896484 C 119.2168 8.9714846 112.80352 5.3976563 106.29102 3.4101562 C 96.775391 0.52265623 86.800781 -0.049072283 76.902344 0.00390625 z M 68.966797 4.7226562 C 78.904297 4.9226563 89.379297 5.1851562 98.529297 9.5351562 C 80.529297 9.6476562 62.503906 9.6585938 44.503906 9.5585938 C 51.803906 5.1960938 60.704297 5.1351562 68.966797 4.7226562 z M 101.00391 7.6835938 C 106.39141 8.6585938 111.7543 10.022266 116.7793 12.197266 C 121.9543 14.622266 124.67773 20.033984 126.67773 25.083984 C 123.14023 23.058984 119.57773 21.058594 116.30273 18.621094 C 112.57773 16.233594 109.11523 13.460156 105.36523 11.097656 C 103.57773 10.447656 102.30391 8.9960937 101.00391 7.6835938 z M 65.628906 78.322266 C 69.176758 78.286719 72.722266 78.389844 76.228516 78.558594 C 86.503516 79.058594 96.778516 80.647266 106.54102 83.947266 C 112.52852 85.897266 117.56602 89.958984 121.85352 94.458984 C 125.00352 97.546484 124.56523 102.38359 124.55273 106.43359 C 123.71523 117.63359 121.61523 128.93359 117.05273 139.24609 C 116.29023 141.53359 114.16523 142.65937 112.17773 143.73438 C 112.16523 177.48438 111.81602 211.24687 112.41602 244.98438 C 114.39102 245.99687 116.92773 246.48359 118.05273 248.62109 C 122.72773 256.32109 119.62813 267.24727 112.51562 272.38477 C 106.46563 276.30977 99.116797 277.32227 92.154297 278.44727 C 77.004297 280.13477 61.590625 280.20898 46.515625 277.77148 C 40.365625 276.60898 33.803906 275.32187 28.878906 271.17188 C 22.991406 265.57188 20.403125 255.75859 24.890625 248.55859 C 27.353125 244.64609 32.628509 245.29648 36.603516 244.58398 C 55.228516 243.09648 73.952734 243.28477 92.615234 243.82227 C 99.015234 243.62227 105.34062 244.65937 111.70312 245.17188 C 112.10312 211.22188 111.92813 177.25859 112.01562 143.30859 C 93.928125 143.72109 75.854297 141.78398 57.779297 142.89648 C 48.616797 142.88398 39.428522 143.98477 30.291016 143.13477 C 26.316016 142.77227 25.654297 137.93359 24.154297 134.99609 C 20.354297 123.04609 17.128516 110.20977 19.103516 97.634766 C 22.491016 91.622266 28.627734 87.546875 34.615234 84.359375 C 44.318364 79.784375 54.985351 78.428906 65.628906 78.322266 z M 131.2168 103.00977 C 131.6668 108.22227 131.90391 113.47148 131.62891 118.70898 C 131.04141 139.83399 132.05312 160.99687 130.89062 182.10938 C 126.47813 182.10938 122.06563 182.09609 117.64062 181.99609 C 118.52812 157.85859 121.4289 133.67266 128.12891 110.41016 C 128.85391 107.83516 129.9293 105.35977 131.2168 103.00977 z M 11.390625 103.02148 C 13.728125 107.14648 14.828125 111.79766 16.015625 116.34766 C 21.603125 137.78516 24.140625 159.92148 24.828125 182.02148 C 20.328125 182.08398 15.829296 182.11016 11.341797 182.03516 C 11.466797 165.14766 10.654297 148.28398 10.966797 131.39648 C 11.191797 121.94648 10.178125 112.44648 11.390625 103.02148 z M 47.916016 167.72266 C 49.928516 171.46016 43.703516 167.96016 47.916016 167.72266 z M 70.427734 168.03516 C 73.077734 168.11016 75.728906 168.13359 78.378906 168.12109 L 78.791016 171.00977 C 75.203516 171.28477 71.591016 171.44727 68.041016 170.69727 C 68.816016 169.78477 69.615234 168.89766 70.427734 168.03516 z M 59.291016 168.07227 C 62.366016 168.13477 65.441406 168.14648 68.503906 168.14648 C 67.941406 172.75898 62.665625 171.22266 59.453125 172.03516 C 59.415625 171.04766 59.341016 169.05977 59.291016 168.07227 z M 57.134766 168.67188 C 57.467578 168.66406 57.882031 168.74453 58.378906 168.91016 C 59.003906 171.01016 58.328516 171.72148 56.353516 171.08398 C 55.875391 169.49961 56.136328 168.69531 57.134766 168.67188 z M 81.953125 168.98242 C 83.040625 169.04961 84.146484 169.60313 84.615234 170.48438 C 84.065234 172.37187 79.929297 172.33398 79.404297 170.39648 C 79.798047 169.33398 80.865625 168.91523 81.953125 168.98242 z M 78.347656 172.07031 C 81.925537 172.0969 85.448047 172.53047 88.841797 174.03516 C 90.391797 174.59766 91.941016 175.13398 93.478516 175.70898 C 93.416016 176.84648 93.365234 177.99648 93.302734 179.14648 L 90.404297 180.69727 C 79.479297 180.83477 68.552734 180.87266 57.615234 180.78516 C 55.227734 180.81016 52.902734 180.16016 50.615234 179.53516 C 50.702734 177.92266 50.778516 176.32266 50.853516 174.72266 C 52.678516 174.37266 54.516016 174.05938 56.353516 173.73438 C 57.678516 173.22188 59.003125 172.72187 60.328125 172.23438 C 66.265625 173.10938 72.384521 172.026 78.347656 172.07031 z M 47.927734 179.39648 C 49.740234 183.20898 43.727734 179.44648 47.927734 179.39648 z M 11.490234 183.89648 C 16.027734 183.92148 20.554297 183.98477 25.091797 184.07227 C 25.604297 196.54727 24.741797 209.02148 23.779297 221.45898 C 22.841797 229.23398 22.028516 237.29727 18.416016 244.38477 C 17.491016 246.59727 15.353125 247.78398 13.390625 248.95898 C 12.103125 240.60898 12.765234 232.15898 12.615234 223.77148 C 12.252735 210.48398 11.702734 197.19648 11.490234 183.89648 z M 117.67773 183.94727 C 122.12773 183.98477 126.59102 183.95977 131.04102 184.00977 C 129.75352 205.65977 130.74023 227.40898 128.99023 249.02148 C 123.62773 246.17148 121.99102 240.02148 120.79102 234.52148 C 117.35352 217.89648 117.56523 200.83477 117.67773 183.94727 z M 18.478516 291.72266 C 20.766016 296.43516 23.553516 300.87148 26.353516 305.27148 C 21.178516 304.24648 15.566015 302.60898 12.166016 298.27148 C 11.716016 296.18398 11.978516 294.03438 11.978516 291.92188 C 14.141015 291.84688 16.316016 291.78516 18.478516 291.72266 z M 124.79102 291.72266 C 126.82852 291.78516 128.85312 291.84688 130.89062 291.92188 C 130.70312 294.42188 131.94102 297.67227 129.66602 299.50977 C 126.25352 302.60977 121.66602 303.81016 117.35352 305.09766 C 119.42852 300.42266 122.26602 296.16016 124.79102 291.72266 z M 27.302734 302.69727 C 36.690241 302.94727 45.816016 305.82109 55.228516 305.80859 C 68.966016 306.17109 82.703906 305.98398 96.441406 305.64648 C 102.89141 305.42148 109.15391 303.63477 115.56641 303.00977 C 110.25391 306.34727 103.74141 306.79688 97.628906 306.92188 C 80.153906 306.87187 62.678125 306.82227 45.203125 306.75977 C 39.103125 306.32227 32.677734 305.90977 27.302734 302.69727 z",
        scale: .1,
        fillColor: "#fdba32",
        fillOpacity: 1,
        strokeWeight: .5,
        rotation: deg,
        anchor: new google.maps.Point(0, 0),
    };
}

var infowindow = new google.maps.InfoWindow({}); 

 /********************************************************************************************************************************/
function loadMap(p) 
{
      result = p; 
      var styledMapType = new google.maps.StyledMapType(
            [
              {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
              {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
              {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
              {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{color: '#c9b2a6' }]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'geometry.stroke',
                stylers: [{color: '#dcd2be'}]
              },
              {
                featureType: 'administrative.land_parcel',
                elementType: 'labels.text.fill',
                stylers: [{color: '#ae9e90'}]
              },
              {
                featureType: 'landscape.natural',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{color: '#93817c'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'geometry.fill',
                stylers: [{color: '#a5b076'}]
              },
              {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{color: '#447530'}]
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#f5f1e6'}]
              },
              {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{color: '#fdfcf8'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#f8c967'}]
              },
              {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#e9bc62'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry',
                stylers: [{color: '#e98d58'}]
              },
              {
                featureType: 'road.highway.controlled_access',
                elementType: 'geometry.stroke',
                stylers: [{color: '#db8555'}]
              },
              {
                featureType: 'road.local',
                elementType: 'labels.text.fill',
                stylers: [{color: '#806b63'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.fill',
                stylers: [{color: '#8f7d77'}]
              },
              {
                featureType: 'transit.line',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#ebe3cd'}]
              },
              {
                featureType: 'transit.station',
                elementType: 'geometry',
                stylers: [{color: '#dfd2ae'}]
              },
              {
                featureType: 'water',
                elementType: 'geometry.fill',
                stylers: [{color: '#b9d3c2'}]
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#92998d'}]
              }
            ],
            {name: 'Styled Map'});
            
             // For route direction on google map .....
             var directionsService = new google.maps.DirectionsService();
             directionsDisplay = new google.maps.DirectionsRenderer();

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 0,
        maxZoom: 0,
        disableDefaultUI: true,
        travelMode: google.maps.TravelMode.DRIVING,
           mapTypeControlOptions: {
                  mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
    });

     map.setZoom(30);

    p.forEach(function(m, i) 
    {
        if (m.lat && m.lng) {

            marker = new google.maps.Marker({position: new google.maps.LatLng(m.lng,m.lat), map: map,title:m.imei,icon : new Icon(0),mapTypeControlOptions: {
                  mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }});

             map_marker[m.imei] = marker;
             marker.setMap(map);
             map.mapTypes.set('styled_map', styledMapType);
             map.setMapTypeId('styled_map');
            directionsDisplay.setMap(map);
          (function (marker , m){

                    google.maps.event.addListener(marker,"click",function(event,i){
                    //var start =  new google.maps.LatLng(m.lng,m.lat);
                   // var end = new google.maps.LatLng(m.lng,m.lat);
                    var contentString = '<p>latitude of Car is '+m.lng+'<br></p>'+
                                        '<p>longitude of Car is '+m.lat+'<br></p>'+
                                        '<p>Imei No '+m.imei+'</p>';
                                         infowindow.setContent(contentString);
                                         infowindow.open(map,marker);
                                         map.setZoom(18);
     /* var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };
        directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        directionsDisplay.setMap(map);
      } 
      else {
        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    });  */            
             });
        })(marker,m);
     includeMarkers();
   }
 });  
}

/**************************************************************************************************************************************/

function getVal() 
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            return (JSON.parse(xhttp.responseText));
        }
    };
    xhttp.open("GET", "api/getValcar", true);
    xhttp.send();
}
/*************************************************************************************************************************************/
var pt = [];
function redraw(p) 
{
  
  console.log("Inside the Redraw...." )
   /* if (map_marker[p.imei]) {
        map_marker[p.imei].setPosition(p);
        map_marker[p.imei].icon.rotation = p.deg;
        map_marker[p.imei].setIcon(map_marker[p.imei].icon);
    } else {*/

      for(var x in map_marker){
        map_marker[x].setMap(null);
      }

      p.forEach(function(m,i)
      {
            marker = new google.maps.Marker({
            position: new google.maps.LatLng(m.lng,m.lat),
            map: map,
            icon: new Icon(0),
            title: m.imei
        });
          map_marker[m.imei] = marker;
            marker.setMap(map);
                    (function (marker , m){

                    console.log("Brijesh " +  m.imei);
                    google.maps.event.addListener(marker,"click",function(event,i){
                    //var start =  new google.maps.LatLng(m.lng,m.lat);
                   // var end = new google.maps.LatLng(m.lng,m.lat);
                    var contentString = '<p>latitude of Car is '+m.lng+'<br></p>'+
                                        '<p>longitude of Car is '+m.lat+'<br></p>'+
                                        '<p>Imei No '+m.imei+'</p>';
                                        infowindow.setContent(contentString);
                                        infowindow.open(map,marker);
                                         map.setZoom(15);
     /* var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING
    };*/
        /*directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
       
        
        directionsDisplay.setMap(map);
      } 
      else {
        alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    }); */               
             });
            }(marker, m));
    //}
    //if (map) 
   // map.panTo(p);
  // includeMarkers();
});
}

//window.onload = getPos;

var socket = io();
/*var socket = io.connect(localhost, {
    transports: ['websocket']
});*/

socket.on('getDeviceLocation', function(socket) {
    //alert(data);
    //console.log(socket);
    f = "getDeviceLocation";
    getPos(f);
   /* var msg={
      imei: 1,
      lat : 12.1233,
      lng : 13.2122
    };*/
    //alert(msg);
    //updategps(msg);
    //socket.emit('pi' , {Brijesh: "Brijesh"} , function(fromserver){
      //  alert(fromserver);
  // });
   //updategps();
    
});

socket.on('updateMarker' , function(socket){
  f = "updateMarker";
  getPos(f);
});

/*function updategps(msg)
{
    //msg.lat+=0.001;
    //msg.lng+=0.001;
    socket.emit('updategps', msg , function(ack){
      //alert(ack);
      console.log("ack:" + ack);
    });
    setTimeout(function(){
      updategps(msg);
    }, 20000);
}*/

/*************************************************************************************************************************************/

function includeMarkers() 
{
    var bounds = new google.maps.LatLngBounds();
    for (var x in map_marker) {
     // alert(map_marker[x]);
        bounds.extend(map_marker[x].getPosition());
    }
    map.fitBounds(bounds);
}

/************************************************************************************************************************************/