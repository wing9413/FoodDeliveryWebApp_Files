'use strict';
var app = angular.module('searchApp', []);
app.controller('searchCtrl', function($scope, $http, $filter) {
var lat ;
var lng ;

  function search(position) {
	var position = JSON.parse(document.cookie);
	lat = position.lat;
	lng = position.lng;
	console.log("position from index page is " +lat+", "+lng);
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
    $http.get(url)
        .then(function(result) {
            var address = result.data.results[1].formatted_address;
            $scope.location = address;
        });		
	findrestaurant();
  }
 
  
  function findrestaurant(){
    $http.get('list.json').then(function mySucces(response) {
	  $scope.showme=true;
	  $scope.table = response.data.restaurant;
    });
  }
//below are for filter 
  $scope.Textsearch = function(item){
    if($scope.searchtext == undefined){
	  return true;
	}
	else{
	  if(item.name.toLowerCase().indexOf($scope.searchtext.toLowerCase()) != -1 ||
	     item.vicinity.toLowerCase().indexOf($scope.searchtext.toLowerCase()) != -1 )
	    return true;
	}
	return false;
  };
//sort order 
  $scope.order = function(predicate){
	var orderBy = $filter('orderBy');
	$scope.predicate = predicate;
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.table = orderBy($scope.table, predicate, $scope.reverse);  
  };
  
//category filter, all pre-selected 
  $scope.categoryIncluded = ["Chinese","Indian","Japanese","Korean","Mexican","Persian","Thai","Vietnamese","Desserts","Pub","Sandwiches","Sport Bar"];
  $scope.includeCat =  function(category){
	var i = $.inArray(category,$scope.categoryIncluded);
	if(i > -1){
	  $scope.categoryIncluded.splice(i,1);
	}else{
	  $scope.categoryIncluded.push(category);
	}
 };
  
  $scope.catfilter = function(cat){
    if($scope.categoryIncluded.length > 0){
      if($.inArray(cat.category, $scope.categoryIncluded) < 0)
		return;
	}
	return cat;
  };

var timing;
  $scope.distance = function(rlat,rlng){
    var resDistance;
	var range = $scope.range || 25;
	$scope.range = range;
    resDistance = calculate(lat, lng, rlat, rlng);
	//estimating time and distance
	$scope.estime = (((resDistance/30)*60)+20);
	timing = $scope.estime;
	$scope.distance1 = resDistance;
    if(range>resDistance){
      return true;
    }else{
	  return false;
	}	
  };
//calculate distance between restaurant and location	
  function calculate(){
    var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
    var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
    var R = 6372.8; // km
    var dLat = lat2 - lat1;
    var dLon = lon2 - lon1;
    var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  }
//onload
  search();
  
 //link to the resturant
 $scope.restaurantPage=function(index){
 	var clickedName = document.getElementsByName("rest")[index].innerHTML;
 	var name = clickedName.substring(1);
 	console.log(name);
 	var found = false;
 	$http.get("list.json").then(function(response){
 		var check = response.data.restaurant;
 		for(var i = 0; i < check.length; i++){
 			if(check[i].name==name){
 				found = true;
 				console.log("restaurant found! redirecting");
 				//check if the restaurant is avaliable for delivery
 				var open = check[i].delivery.open;
 				var close = check[i].delivery.close;
 				var openOrClose = checkOpen(open, close);
 				//re-create the cookie for going back
 				var string = JSON.parse(document.cookie);
 				var lat = string.lat;
 				var lng = string.lng;
 				var result = '{"lat":"' + lat + '", "lng": "' + lng + '", "name":"' + name + '","open":"'+openOrClose + '","estime":"'+timing+'"}';
 				var tkm = new Date();
    			tkm.setTime(tkm.getTime() + 96*3600000);
    			var expires = "; expires=" + tkm.toGMTString();
    			//clear cookie
    			document.cookie = "hello; expires=Thu, 01 Jan 2015 00:00:00 UTC";
    			//new cookie
				document.cookie= result + expires + "; path=/" ;
 				console.log(document.cookie);
 				window.location = "cart.html";
 			}
 			else{
 				found = false;
 			}
 		}
 		if(found = false){
 			alert("Sorry,System error. Please try again");
 		}
 	});
 };
 
 function checkOpen(open, close){
 	var offset = -4.0;
 	var date = new Date();
 	console.log("date now is: " + date);
 	var hour = date.getHours();
 	console.log("Time now is: " + hour);
 	var dummy = new Date();
 	dummy.setHours(open);
 	var openTime = dummy.getHours();
 	var dummy2 = new Date();
 	dummy2.setHours(close);
 	var closeTime = dummy2.getHours();
 	console.log("the restaurant opens at: " + openTime + " and close at: " + closeTime);
 	//for those open at day time
 	if(openTime < closeTime){
 		if(openTime < hour && closeTime > hour){
 			console.log("The restaurant is avaliable for delivery!");
 			return true;
 		}
 		else{
 			console.log("Sorry, The restaurant closed!");
 			return false;
 		}
 	}
 	//for those open at night time
 	else{
 		if(openTime < hour || closeTime > hour){
 			console.log("The restaurant is avaliable for delivery!");
 			return true;
 		}
 		else{
 			console.log("Sorry, The restaurant closed!");
 			return false;
 		}
 	}
 }
 
});