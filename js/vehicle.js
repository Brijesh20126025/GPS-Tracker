function getVehicle(id){
    //alert(id);
   if(id==2){
    var div = document.getElementById('getcarinfo');
   // div.removeChild(div);
   }
   if(id==1){
    var res={};
    var ul,text;
    var li;
    div = document.getElementById('carinfo');
    var total_li = div.getElementsByTagName('li').length;
    ul = document.getElementById('getcarinfo');
    if(total_li == 0)
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 200){
         res =JSON.parse(xhttp.responseText);
            res.forEach(function(m,i){      
                 li = document.createElement('li');
                 li.style.font = "italic bold 20px arial,serif";
                 text = document.createTextNode(m.cab);
                 img = document.createElement('img');
                 img.setAttribute("src", "img/taxi.png");
                 img.setAttribute("height","30px");
                 img.setAttribute("width","30px");
                 li.appendChild(img);
                 a = document.createElement('a');
                 a.appendChild(text);
                 li.appendChild(a);
                 ul.appendChild(li);
                 div.appendChild(ul);

            });
        }
       // div.style.border = "1px solid red";
    };
     xhttp.open("GET", "api/getDevicePos", true);
     xhttp.send();
 }
    }

}




