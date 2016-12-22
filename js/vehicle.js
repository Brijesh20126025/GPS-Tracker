function getVehicle(id){
	var res="";
	var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if (xhttp.readyState == 4 && xhttp.status == 200){
            res=JSON.parse(xhttp.responseText);
            for(var i=0; i < res.length; i++){
            	//alert(i.imei+" "+i.lat + " "+i.lng);
            }
        }
    };
    xhttp.open("GET", "api/getDevicePos", true);
    xhttp.send();
}