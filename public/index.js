//autocomplete js
var inputLat;
var inputLng;
var input = document.getElementById('autocomplete');
var autocomplete = new google.maps.places.Autocomplete(input,{componentRestrictions: {country: "ca"}});
google.maps.event.addListener(autocomplete, 'place_changed', function(){
	var place = autocomplete.getPlace();
    //additional functions for autocomplete	
    inputLat = place.geometry.access_points[0].location.lat;
    inputLng = place.geometry.access_points[0].location.lng;
    console.log(inputLat);
    console.log(inputLng);
    });
function searchPlace(){
	if(inputLat!= undefined & inputLng != undefined){
		var locat = '{"lat":"' + inputLat + '", "lng": "' + inputLng + '"}';
        var tkm = new Date();
        tkm.setTime(tkm.getTime() + 96*3600000);
        var expires = "; expires=" + tkm.toGMTString();
        document.cookie = "hello; expires=Thu, 01 Jan 2015 00:00:00 UTC";
		document.cookie= locat  + expires + "; path=/" ;
		window.location="searchv1.html";
	}
	else{
		alert("Place not found!\nplease enter again or get your current location");
	}
}

//get current location
function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showLocation);
	}
	else{
		locations.innerHTML = "The browser does not support Geolocation";
	}
}

function showLocation(position){
	var locat = '{"lat":"' + position.coords.latitude + '", "lng": "' + position.coords.longitude + '"}';
	//creates cookie for searching
    var tkm = new Date();
    tkm.setTime(tkm.getTime() + 96*3600000);
    var expires = "; expires=" + tkm.toGMTString();
    document.cookie = "hello; expires=Thu, 01 Jan 2015 00:00:00 UTC";
	document.cookie= locat + expires + "; path=/" ;
	window.location="searchv1.html";
}