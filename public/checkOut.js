'use strict';
var app = angular.module('checkOutApp', []);
app.controller('CheckoutCtrl', function ($scope,$http) {
	//get cookie
		var string = JSON.parse(document.cookie);
		console.log(string);
	    var price = string.price;
	 	var lat = string.lat;
	 	var lng = string.lng;
	 	var locat;
	//get the location back
		var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&sensor=true";
		$http.get(url)
        .then(function(result) {
            var address = result.data.results[1].formatted_address;
            $scope.location = address;
            locat = $scope.location;
        });
        console.log('the address entered is: '+locat);
	//functions
		$scope.totalAmount = price;

		$scope.onSubmit = function () {
			$scope.processing = true;
		};

		$scope.stripeCallback = function (code, result) {
			$scope.processing = false;
			$scope.hideAlerts();
			if (result.error) {
				$scope.stripeError = result.error.message;
			} else {
				$scope.stripeToken = result.id;
			}
		};

		$scope.hideAlerts = function () {
			$scope.stripeError = null;
			$scope.stripeToken = null;
		};
	
		$scope.cancelOrder = function(){
			window.location="cart.html";
		};
		
		$scope.placeOrder = function(){
			//makes a new cookie again
			var str = JSON.parse(document.cookie);
			var name = str.name;
			var open = str.open;
			var estime = str.estime;
			var price = str.price;
            var tkm = new Date(); 
            tkm.setTime(tkm.getTime() + 96*3600000);
            var expires = "; expires=" + tkm.toGMTString();
            document.cookie = "hello; expires=Thu, 01 Jan 2015 00:00:00 UTC";
			var result = '{"lat":"' + lat + '", "lng": "' + lng + '", "name":"' + name + '","open":"'+open + '","estime":"'+estime+'","price":"'+price+'","address":"'+locat+'"}';
			console.log("cookie to next page: " +result);
            document.cookie= result+ expires + "; path=/";
			window.location="thankyou.html";
		};
});
//choose delivery time
app.controller('checkController',function($scope,$http){
		var string = JSON.parse(document.cookie);
		var openOrClose = string.open;
	 	var name = string.name;
		$http.get("list.json").then(function(response){
			var date;
			var string;
			var timeInter = [];
			var todayInter = [];
 			var check = response.data.restaurant;
 			for(var i = 0; i < check.length; i++){
 				if(check[i].name==name){
 					console.log("restaurant found! redirecting");
 					//check if the restaurant is avaliable for delivery
 					var open = check[i].delivery.open;
 					var close = check[i].delivery.close;
 					//for those open at day time
 					if(open < close){
 						for(var i = open; i<close; i++){
 							timeInter.push('{"time":"'+i+':00"}');
 						}
 					}
 					else{
 						for(var i = open; i<24; i++){
 							timeInter.push('{"time":"'+i+':00"}');
 						}
 						for(var i = 0; i < close; i++){
 							timeInter.push('{"time":"'+i+':00"}');
 						}
 					}
 					var date = new Date();
 					var hour = date.getHours();
 					if(open < close){
 						for(var i = hour; i<close; i++){
 							todayInter.push('{"time":"'+i+':00"}');
 						}
 					}
 					else{
 						if(hour<24&&hour >= open){
 							for(var i = hour; i<24; i++){
 								todayInter.push('{"time":"'+i+':00"}');
 							}
 							for(var i = 0; i < close; i++){
 								todayInter.push('{"time":"'+i+':00"}');
 							}
 						}
 						else if(hour < close){
 							for(var i = hour; i < close; i++){
 								todayInter.push('{"time":"'+i+':00"}');
 							}
 						}
 					}
 				}
 			}
 			console.log(openOrClose);
 			if(openOrClose==true || openOrClose=='true'){
 				date = '[{"name":"Today","option":['+todayInter+']},{"name":"Tomorrow","option":['+timeInter+']},{"name":"The Day After Tomorrow","option":['+timeInter+']}]';
 				console.log("in true");
 				string = JSON.parse(date);
 				console.log(string);
 			}
 			else if(openOrClose==false||openOrClose=='false'){
 				date = '[{"name":"Tomorrow","option":['+timeInter+']},{"name":"The Day After Tomorrow","option":['+timeInter+']}]';
 				console.log("in false");
 				string = JSON.parse(date);
 				console.log(string);
 			}
 		$scope.resultOption=string;
 		console.log($scope.resultOption);
		});
});