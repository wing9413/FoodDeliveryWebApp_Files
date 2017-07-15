'use strict';
//get cookie for name:
		var cookies = JSON.parse(document.cookie);
		var name = cookies.name;
        var deliveryTime = cookies.open;
Stripe.setPublishableKey('pk_test_aj305u5jk2uN1hrDQWdH0eyl');

var app = angular.module('foodApp', ['angularPayments', 'mm.foundation', 'ngAnimate', 'angularSpinner'])

	.controller('foodCtrl', function ($scope, $http) {
		$scope.cart = [];
        $scope.deliveryTime = deliveryTime;

        console.log("deliveryTime" + $scope.deliveryTime);

		// Load products from server
		$http.get('./restInfo/'+name+'.json').success(function (response) {
			$scope.products = response.products;
            $scope.categories = response.categories;
            $scope.restName = response.restName;
            $scope.phone = response.phone;
            $scope.address = response.address;
            $scope.opening = response.opening;
           console.log('opening is: ' + $scope.opening);
		});
        
        $scope.remove = function (product) {
			$scope.cart.forEach(function (item) {
				if (item.id === product.id) {
                    if (item.quantity > 0)
					item.quantity--;
				}
			});
		};

		$scope.addToCart = function (product) {
			var found = false;
			$scope.cart.forEach(function (item) {
				if (item.id === product.id) {
					item.quantity++;
					found = true;
				}
			});
			if (!found) {
				$scope.cart.push(angular.extend({quantity: 1}, product));
			}
		};

		$scope.getCartPrice = function () {
			var total = 0;
			$scope.cart.forEach(function (product) {
				total += product.price * product.quantity;
			});
			return total;
		};
		
		$scope.getTotalPrice = function () {
			return $scope.getCartPrice()+5;
		};
		
		$scope.checkout = function () {
			var str = JSON.parse(document.cookie);
			var lat = str.lat;
			var lng = str.lng;
			var name = str.name;
			var open = str.open;
			var estime = str.estime;
            var tkm = new Date(); 
            tkm.setTime(tkm.getTime() + 96*3600000);
            var expires = "; expires=" + tkm.toGMTString();
            document.cookie = "hello; expires=Thu, 01 Jan 2015 00:00:00 UTC";
			var price=$scope.getCartPrice()+5;
			var result = '{"lat":"' + lat + '", "lng": "' + lng + '", "name":"' + name + '","open":"'+open + '","estime":"'+estime+'","price":"'+price+'"}';
			console.log("cookie to next page: " +result);
            document.cookie= result+ expires + "; path=/";
            window.location="checkOut.html";
		};
        
        $scope.openingTime = function(){
            var date = new Date();
             var hour = date.getHours();
            var open = false;
            var openTime = $scope.opening.open;
            var closeTime = $scope.opening.close;
            if (openTime < closeTime){
               if(hour>openTime&&hour<closeTime){
                open = true;
                }
                else{
                	open = false;
                }
          }
           else{
               if(hour>openTime||hour<closeTime){
               	open =true;
               }
               else{
               	open=false;
               }
            }
            return open;
        };
        
	});
