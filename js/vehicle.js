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
                // alert(xhttp.responseText);   
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
                   '<div id="collapse1" class="panel-collapse collapse in" style="height:200px;padding:10px;border:2px solid gray;margin:10px">'+
                   '<div class="panel-body">'+
                    '<div>'+
                     '<p>'+
                     '<img src="img/driver.jpg" width="15px" height="15px"></img> Driver  '+m.user+'<br>'+
                     '<hr>'+
                    '</p>'+
                    '<p>'+
                     'since '+m.sDate+' to '+ new Date()+'<br>'+
                    '</p>'+
                    '<hr>'+
                    '<button type="button" onclick = "show('+m.imei+');"style="margin-left:40px;color:purple">Show</button>'+
                    '<button type="button" style="margin-left:40px;color:red">Track</button>'+
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
    //alert("Brijesh SHow "+ imei);
    //alert(map.getZoom());
    for(x in map_marker){
        console.log(x);
        if(x==imei){
            console.log("brijesh " + x);
            map.setCenter(map_marker[x].getPosition());
            map.setZoom(25);
        }
    }
}






