var url="./restInfo/"+ name +".json";
	var lat ;
    var lon ;
	var address;
console.log("name:"+name);
getJson1(url);
      function initMap(lat,lon) {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: {lat: parseFloat(lat), lng: parseFloat(lon)}
        });
          var marker = new google.maps.Marker({
              position: {lat: parseFloat(lat), lng: parseFloat(lon)}
            });
          marker.setMap(map);
        var geocoder = new google.maps.Geocoder();

      }
                
    function getJson1(url){
var xhr1 = new XMLHttpRequest();
xhr1.open("GET", url, true);
xhr1.onload = function (e) {
  if (xhr1.readyState === 4) {
    if (xhr1.status === 200) {
      
      var result= JSON.parse(xhr1.responseText);
	lat=parseFloat(result.location.lat);
	lon=parseFloat(result.location.lng);
	address=result.address;
    initMap(lat,lon);
    } else {
      console.error(xhr1.statusText);
    }
  }
};
xhr1.onerror = function (e) {
  console.error(xhr1.statusText);
};
xhr1.send();
}
        