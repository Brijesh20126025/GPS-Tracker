//var path = require('path');

//var db = require("/../server/db.js");
//var dbio = require("../server/dbio");
 var TRACK = {};
 var poly="";
function getVehicle(id){
   if(id==2){
    var div = document.getElementById('carinfo');
    var visibility = div.style.visibility;
    if(visibility!="hidden"){
        div.style.visibility='hidden';
    }
}
   if(id==1){
    var ul,text;
    var li;
    div = document.getElementById('carinfo');
    var total_li = div.getElementsByTagName('li').length;
    ul = document.getElementById('getcarinfo');
    if(div.style.visibility=="hidden"){
        div.style.visibility='visible';
    }
    if(total_li == 0)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 200){
         var res =JSON.parse(xhttp.responseText);
            res.forEach(function(m,i){   
                 //alert(xhttp.responseText);   
                 indiv = document.createElement('div');
                 indiv.setAttribute("id",i);
                 indiv.setAttribute("class" ,"collapse");
                 li = document.createElement('li');
                 text = document.createTextNode(m.imei);
                 img = document.createElement('img');
                 img.setAttribute("src", "img/taxi.png");
                 img.setAttribute("height","20px");
                 img.setAttribute("width","20px");
                 li.appendChild(img);
                 a = document.createElement('a');
                 a.setAttribute("class", "accordion");
                 a.setAttribute("data-toggle","collapse");
                 var l = "#"+i;
                 a.setAttribute("href" , l);
                 a.appendChild(text);
                 li.appendChild(a);
                 ul.appendChild(li);
                 li.appendChild(indiv);
                 div.appendChild(ul);
                 a.addEventListener("click" , function(event){
                   document.getElementById(i).innerHTML=
                   '<div id="collapse1" class="panel-collapse collapse in" style="height:350px;padding:10px;border:2px solid gray;margin:10px">'+
                   '<div class="panel-body">'+
                    '<div>'+
                     '<p>'+
                     '<img src="/img/driver.jpg" width="15px" height="15px"></img> <strong>Driver</strong> '+m.user+'<br>'+
                     '<p><strong>License Plate No</strong> : '+m.cab+'</p>'+
                     '<p><strong>Speed</strong> : '+(m.speed=="" ? 0: m.speed)+'</p>'+
                     '<p><strong>Mobile No</strong> : '+m.phone+'</p>'+
                     '<p><strong>Latitude</strong> : '+m.lng+'</p>'+
                     '<p><strong>Longitude</strong>: '+m.lat+'</p>'+
                     '<hr>'+
                    '</p>'+
                    '<p>'+
                     'since '+m.sDate+' to '+ new Date()+'<br>'+
                    '</p>'+
                    '<hr>'+
                    '<button type="button" onclick = "show('+m.imei+');" style="margin-left:40px;color:purple">Show</button>'+
                    '<button type="button" onclick = "track('+m.imei+');" style="margin-left:40px;color:red">Track</button>'+
                    '<button type="button" style="margin-left:40px;color:blue">Details</button>'+
                    '</div>'+
                    '</div>'+
                    '</div>';
                   event.preventDefault();
                 });
            });
        }
        };
     xhttp.open("GET", "api/getDevicePos", true);
     xhttp.send();
    }
}
}

function show(imei){
    if(poly){
        poly.setVisible(false); 
    }
    //alert("Brijesh SHow "+ imei);s
    //alert(map.getZoom());
    for(x in map_marker){
        //console.log(x);
        if(map_marker[x].setVisible == false){
            map_marker[x].setVisible(true);
        }
        if(x==imei){
            map_marker[x].setVisible(true);
            console.log("brijesh " + x);
            map.setCenter(map_marker[x].getPosition());
            map.setZoom(25);
        }
    }
}

function track(imei){
    //var m;
    var latlng =[];
       //setMapOnAll(null);                  // Clear all markers from the map

    //var marker;
     for(var x in map_marker){
        map_marker[x].setVisible(false);
      }
        var marker;
        var bounds = new google.maps.LatLngBounds();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 200){
           // alert(xhttp.responseText);
            var res = JSON.parse(xhttp.responseText);

             var circle ={
             path: google.maps.SymbolPath.CIRCLE,
             fillColor: 'red',
             fillOpacity: .2,
             scale: 2.5,
             strokeColor: 'white',
             strokeWeight: 0.9
            };

            res.forEach(function(m,i){
                console.log(m.lat);
                console.log(m.lng);
                     marker = new google.maps.Marker({
                    position: new google.maps.LatLng(m.lng,m.lat),
                    map: map,
                    icon : circle
        
                });
                     // marker.setVisible(false);
                     (function (marker , m){

                    //console.log("Brijesh " +  m.imei);
                    google.maps.event.addListener(marker,"mouseover",function(event,i){
                    //var start =  new google.maps.LatLng(m.lng,m.lat);
                   // var end = new google.maps.LatLng(m.lng,m.lat);
                    var contentString = '<p>latitude of Car is '+m.lng+'<br></p>'+
                                        '<p>longitude of Car is '+m.lat+'<br></p>'+
                                        '<p>Imei No '+imei+'</p>'+
                                        '<p>Id No '+m.id+'</p>';
                                        infowindow.setContent(contentString);
                                        infowindow.open(map,marker);
                                        });
                    }(marker, m));

                    
                    //marker.setMap(map);
                    //marker.setMap(map);
                    TRACK[i]=marker;
                    latlng.push(marker.getPosition());
                   // bounds.extend(marker.getPosition());

        });          
            
        var flightPath = new google.maps.Polyline({
            path: latlng,
            strokeColor: "#FF0000",
            strokeOpacity: 4.0,
            strokeWeight: 3
            });
            poly = new google.maps.Polyline(flightPath);
            poly.setMap(map);
            var bounds = new google.maps.LatLngBounds();
             for (var x in TRACK) {
                //console.log(TRACK[x]);
                bounds.extend(TRACK[x].getPosition());
             }
             map.fitBounds(bounds); 
            //var bounds = new google.maps.LatLngBounds();
            //map.setZoom(18);
    }

    };
    var url = "api/getTable"+"?"+"imei="+imei;
    xhttp.open("GET" , url, true);
    xhttp.send();
}




