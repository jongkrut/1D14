var url = "http://128.199.190.218";
var app = angular.module('indexApp', [
  "sdfilters",
  "cart",
  "search",
  "ionic",
  "customer",
  "ui.bootstrap.datetimepicker"
]);

app.config(['$httpProvider', function($httpProvider) {
          $httpProvider.defaults.useXDomain = true;

          /**
           * Just setting useXDomain to true is not enough. AJAX request are also
           * send with the X-Requested-With header, which indicate them as being
           * AJAX. Removing the header is necessary, so the server is not
           * rejecting the incoming request.
           **/
          delete $httpProvider.defaults.headers.common['X-Requested-With'];
      }
]);

app.config(['$stateProvider', function($stateProvider) {
	$stateProvider.state('login', {	
					url : '/login',
					templateUrl : 'login.html',
					controller : 'loginCtrl'
	}).state('midlogin', {	url : '/login-mid/:outlet_id/:brand_id',
							templateUrl : 'login.html',
							controller : 'midLoginCtrl'
	}).state('home', { 	url : '/',
						cache : false,
						templateUrl : 'home.html',
						controller : 'homeCtrl'
	}).state('history',{
						url : '/history/:id',
						templateUrl : 'history.html',
						controller : 'historyCtrl'
	}).state('my-account', { 	
						url : '/my-account',
						templateUrl : 'account.html',
						controller : 'accountCtrl'
	}).state('my-address', { 	
						url : '/my-address',
						templateUrl : 'address.html',
						controller : 'addressCtrl'
	}).state('new-address', { 	
						url : '/new-address',
						templateUrl : 'address-new.html',
						controller : 'newAddressCtrl'
	}).state('map-search', { 
						url : '/map-search',
						templateUrl : 'map-search.html',
						controller : 'mapsCtrl'
	}).state('location-search', { 
						url : '/location-search',
						templateUrl : 'map-search.html',
						controller : 'locationCtrl'
	}).state('search', { 
						url : '/search',
						templateUrl : 'search.html',
						controller : 'searchCtrl'
	}).state('restaurant', { 
						url : '/restaurant/:outlet_id/:brand_id',
						templateUrl : 'restaurant.html',
						controller : 'restoCtrl'
	}).state('order', { 
						url : '/order/:outlet_id/:brand_id/:as',
						templateUrl : 'order.html',
						controller : 'orderCtrl'
	}).state('cart', { 
						url : '/cart/:outlet_id/:brand_id',
						templateUrl : 'cart.html',
						controller : 'cartCtrl'
	}).state('checkout', { 
						url : '/checkout/:outlet_id/:brand_id',
						templateUrl : 'checkout.html',
						controller : 'checkoutCtrl'
	}).state('confirmation', { 
						url : '/confirmation/:order_id',
						templateUrl : 'confirmation.html',
						controller : 'confirmationCtrl'
	}).state('feedback',{
						url : '/feedback/',
						templateUrl : 'feedback.html',
						controller : 'feedbackCtrl',
						cache : false
	}).state('pages', { 
						url : '/pages/:page',
						templateUrl : 'faq.html'
	}).state('how-to-order',{
						url : '/how-to-order',
						templateUrl : 'howtoorder.html'
	}).state('faq', { 
						url : '/faq/',
						templateUrl : 'faq.html'
	}).state('faq2',{
						url : '/faq2/:page',
						templateUrl : 'faq2.html',
						controller : 'faqCtrl'
	});	
}]);

app.config(function($urlRouterProvider,$ionicConfigProvider){ 
    $urlRouterProvider.when('', '/');
	$ionicConfigProvider.views.maxCache(0);
	$ionicConfigProvider.backButton.text('');
});

app.run(function($rootScope,$ionicNavBarDelegate,$ionicSideMenuDelegate,$ionicPopover,$location,Customer,$ionicPlatform){
	$ionicPlatform.ready(function() {
		var logged = Customer.isLogged();
		if(logged == true) {
			Customer.refreshAddress();
		}
	});

	$rootScope.toHome = function() {
		$location.path('/');
	};

	$rootScope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};
	
	$rootScope.goBack = function() {
		$ionicNavBarDelegate.back();
	};

	$ionicPopover.fromTemplateUrl('popover-account.html', {
		scope: $rootScope,
	}).then(function(popover) {
	    $rootScope.popover = popover;
	});
	  

	$rootScope.openPopover = function($event) {
    	$rootScope.popover.show($event);
	};
	$rootScope.closePopover = function() {
	    $rootScope.popover.hide();
	};
	$rootScope.$on('$destroy', function() {
	    $rootSscope.popover.remove();
	});
	$rootScope.logout = function() {
		Customer.logout();
		$rootScope.popover.hide();
	};
});

app.controller('panelCtrl',function($scope,$location,Customer){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
    $scope.$on('state.login', function () {
    	$scope.logged_in = true;
    });
});

app.controller('addressCtrl',function($scope,$http,$location,Customer,$ionicSideMenuDelegate){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$scope.newAddress = true;
    });
	$scope.addresses = Customer.getAddress();
});

app.controller('historyCtrl',function($scope,$http,$state,$stateParams,$ionicSideMenuDelegate,Customer){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
	    	$scope.logged_in = false;
	    	$scope.newAddress = true;
	});
	if($scope.logged_in == true)
	{
		$scope.order_id = $stateParams.id;
		$scope.customer_id = Customer.getCustomerID();
		$scope.orderhistory = {};
		$scope.details = {};
		if($scope.order_id == '') {
			var urlLogin = url + "/orderHistory.php?customer_id="+$scope.customer_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				$scope.orderhistory = data.history;
			});
		} else {
			var urlLogin = url + "/orderHistoryDetail.php?customer_id="+$scope.customer_id+"&order_id="+$scope.order_id+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				$scope.details = data.history_detail;
				console.log(data.history_detail);
			});
		}
	} else {
		$state.go('home');
	}

	$scope.toDetail = function(order_id){
		$state.go('history', { 'id' : order_id });
	};
});

app.controller('accountCtrl',function($scope,$http,Customer,$state){
	$scope.customer = Customer.getCustomer();

});

app.controller('loginCtrl',function($scope,$http,Customer,Search,$state){
	$scope.errorLogin = 0;
	$scope.logged_in = Customer.isLogged();
	if($scope.logged_in == true) {
		$state.go('home');
	}
	$scope.doLogin = function (user) {
			var urlLogin = url + "/login.php?user="+user.email+":"+user.password+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				if(data.login == 0) {
					$scope.errorLogin = 1;
				} 
				else {
					var address = data.address;
					delete data.login;
					delete data.address;

					Customer.login(data,address);
					$scope.errorLogin = 0;
					$state.go('home');
				}
			});
    };
    $scope.doSignUp = function (user) {
    	$http.defaults.useXDomain = true;
		$http({
		    url: url + "/signup.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
		    data: user
		})
		.then(function(response) {
			console.log(response.data);
			if(response.data.customer_id > 0) {
				Customer.init(response.data);
		    	$state.go('home');
			} 
		});
    };
});

app.controller('midLoginCtrl',function($scope,$stateParams,$http,$location,Customer,Search){
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.doLogin = function (user) {
			var urlLogin = url + "/login.php?user="+user.email+":"+user.password+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data) {
				if(data.login == 0) {
					$scope.errorLogin = 1;
				} 
				else {
					var address = data.address;
					delete data.login;
					delete data.address;

					Customer.init(data);
					Customer.setAddress(address);
					$scope.errorLogin = 0;
					$location.path('/checkout/'+$scope.outlet_id+'/'+$scope.brand_id);
				}
			});
    };
    $scope.doSignUp = function (user) {
		console.log(user);
    };
});

app.controller('homeCtrl',function($scope,$location,$ionicSideMenuDelegate,$ionicLoading,$http,$ionicModal,Customer,Search,$window){
	$scope.newAddress = true;
	$scope.logged_in = Customer.isLogged();
	$scope.data  = {};
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$scope.newAddress = true;
    });
	if($scope.logged_in == true){
		$scope.customer = Customer.getCustomer();
		$scope.defaultAddress = Customer.getDefaultAddress();
		$scope.addresses = Customer.getAddress();
		$scope.newAddress = false;
		$scope.data.selected = $scope.defaultAddress.address_id;
		Search.init();
	}

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Searching for Restaurants ...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};
    $scope.toMap = function(){
		$location.path('/map-search');
    };

    $ionicModal.fromTemplateUrl('chooseAddress-modal.html', {
    	scope: $scope,
    	animation: 'slide-in-up'
	}).then(function(modal) {
	    $scope.modal = modal;
	});
	
	$scope.openModal = function() {
	    $scope.modal.show();
	};
	$scope.closeModal = function() {
	    $scope.modal.hide();
	};
	$scope.applyModal = function() {
		var selected = $scope.data.selected;
		$scope.defaultAddress = Customer.getAddressById(selected);
		$scope.modal.hide();
	};
	$scope.$on('$destroy', function() {
	    $scope.modal.remove();
	});

	$scope.toSearch = function(){
		$scope.show();
		$scope.latitude = $scope.defaultAddress.latitude;
		$scope.longitude = $scope.defaultAddress.longitude;
		$http.get("http://backoffice.satudelivery.com/protected/ordering/area.json").success(function(data){
		    var areaJson = data; 
			angular.forEach(areaJson, function(value,key){
				angular.forEach(value.outlet,function(value1,key1){
					var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
					var pathPoly = new google.maps.Polygon({
						path: pathArray
					});
					if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng($scope.latitude,$scope.longitude),pathPoly)) {
					    Search.addOutlet(value1.id);
					}				
				});
			});
			Search.setType($scope.defaultAddress.address_id);
			$scope.hide();
			$location.path("/search");
		});
	};
});

app.controller('restoCtrl',function($scope,$stateParams,$http,Customer){
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
	var urlLogin = url + "/outletInfo.php?outlet_id="+$scope.outlet_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin).success(function(data) {
		$scope.outletInfo = data.outlet;	
		urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.outletInfo.brand_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLogin).success(function(data){
				$scope.menuCategories = data.category;
		});

    });
}).directive('restaurant',function() {
	return {
		restrict : 'E',
		templateUrl: 'restaurant-template.html'
	};
});

app.controller('searchCtrl',function($scope,$stateParams,$http,Search,Customer){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
	var urlLogin = url + "/search.php?outlet_id="+Search.getAll().replace("[","").replace("]","")+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin).success(function(data) {
			$scope.outlets = data.outlet;
	});
});

app.controller('orderCtrl',function($scope,$stateParams,$ionicModal,$http,Cart,$ionicLoading,$location,Customer){
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.tab = $stateParams.as;
	$scope.menuz = [];
	$scope.menu = {};
	var arrayLoaded = [];

	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};
	
	
	var urlLogin = url + "/outletMenuCategory.php?brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlLogin).success(function(data){
		$scope.menuCategories = data.category;
		if($scope.tab !== "") {
			urlLogin = url + "/outletMenu.php?category_id="+$scope.tab+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data){
				$scope.menuz[$scope.tab] =data.menu;
				arrayLoaded.push($scope.tab);
				$scope.menus = $scope.menuz[$scope.tab];
			});
		}
	});
	$scope.loadMenu = function(a) {
		$scope.tab = a;
		if(arrayLoaded.indexOf(a) == -1 ) {
			urlLogin = url + "/outletMenu.php?category_id="+a+"&callback=JSON_CALLBACK";
			$http.jsonp(urlLogin).success(function(data){
				$scope.show();
				$scope.menuz[a] =data.menu;
				arrayLoaded.push(a);
				$scope.menus = $scope.menuz[a];
				$scope.hide();
			});
		} else {
			$scope.menus = $scope.menuz[a];
		}
	}

	$scope.openModal = function (data){
		$scope.menu_id = data;
		$scope.menu = {};
		var urlLogin = url + "/menuInformation.php?menu_id="+$scope.menu_id+"&callback=JSON_CALLBACK";
		$http.jsonp(urlLogin).success(function(data){
			$scope.menu = data.menu;
			$scope.menu.qty = 1;
			if(data.menu.size.length>0) {
				$scope.menu.size_id = $scope.menu.size[0]; 
			}
			$scope.modal.show();
		});
		
  	};
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};

  	$scope.addToCart = function (inputs) {
		delete inputs['size'];
		delete inputs['menu_description'];
		var temp = [];
		angular.forEach(inputs.attr,function(value,key){
			if(value.selected == true) {
				temp.push(value);
			}
		});
		if(temp.length == 0)
			delete inputs['attr'];
		else
			inputs.attr = temp;
		Cart.addItem(inputs);
	    $scope.modal.hide();
	    $scope.items = Cart.getTotalItems();
		$scope.prices = Cart.getTotalPrice();
	};

	$ionicModal.fromTemplateUrl('myModalContent.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

	$scope.$on('$destroy', function () {
	  $scope.modal.remove();
	});

	$scope.$watch('menu',function(){
	    var price_ea = $scope.menu.menu_price;
	    if(typeof $scope.menu.size_id != "undefined")
			price_ea = $scope.menu.size_id.size_price;
	    var price_attr = 0;
	    angular.forEach($scope.menu.attr,function(value,key){
			if(value.selected == true) {
			    price_attr += value.attribute_price;
			}
	    });
	    $scope.total = $scope.menu.qty * (price_ea + price_attr);
	},true);

  	Cart.init($scope.outlet_id);
  	$scope.items = Cart.getTotalItems();
  	$scope.prices = Cart.getTotalPrice();
	
	$scope.goToCart = function() {
		$location.path("/cart/"+$scope.outlet_id+"/"+$scope.brand_id);
	};
}).directive('cartcontents',function() {
	return {
		restrict : 'E',
		templateUrl: 'cartcontents-template.html'
	};
});




app.controller('mapsCtrl',function($scope,$http,$ionicLoading,Search,$location,Customer) {
	var areaJson = {};
	$scope.searchInput = false;
	Search.init();
	Search.setType("0");
	$scope.areaCoverage = 0;
	$scope.latitude = -6.219260;
	$scope.longitude = 106.812410;

	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

	$scope.show();
	var mapOptions = {	center: new google.maps.LatLng($scope.latitude,$scope.longitude),
					 	zoom : 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false
					 };

	$scope.map =  new google.maps.Map(document.getElementById('map'), mapOptions);
	var myLocation = new google.maps.Marker({
		            position: new google.maps.LatLng($scope.latitude,$scope.longitude),
		            map: $scope.map,
					draggable: true,
		            title: "My Location"
				});
	var input = document.getElementById('addr_input');
	var autooption = {
		componentRestrictions : { country: 'id' }
	};
	var autocomplete = new google.maps.places.Autocomplete(input,autooption);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		myLocation.setVisible(false);
		var place = autocomplete.getPlace();
		var latlng = place.geometry.location;
		$scope.map.setCenter(latlng);
		myLocation.setPosition(latlng);
		myLocation.setVisible(true);
	});
	
	google.maps.event.addListener(myLocation,'dragend',function(){
		var latlng = myLocation.getPosition();
		$scope.latitude = latlng.lat();
		$scope.longitude = latlng.lng();
		$scope.map.setCenter(latlng);	
		var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
		$http.get(httpz).success(function(data){
		   	$scope.full_address = data.results[0].formatted_address;
		});
		var log = 0;
		Search.remove();
		Search.addLoc($scope.latitude,$scope.longitude);
		Search.setType("0");
		angular.forEach(areaJson, function(value,key){
			angular.forEach(value.outlet,function(value1,key1){
				var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
				var pathPoly = new google.maps.Polygon({
					path: pathArray
				});
				if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng($scope.latitude,$scope.longitude),pathPoly)) {
				    log++;
				    Search.addOutlet(value1.id);
				}				
			});
		});
		$scope.areaCoverage = log;
	});
	
	$http.get("http://backoffice.satudelivery.com/protected/ordering/area.json").success(function(data){
        areaJson = data; 
        if(navigator.geolocation) {
			myLocation.setVisible(false);
	    	navigator.geolocation.getCurrentPosition(function(position) {
				$scope.latitude = position.coords.latitude;
		        $scope.longitude = position.coords.longitude;
		        $scope.accuracy = position.coords.accuracy;
		        $scope.$apply();
				
				var latlng = new google.maps.LatLng($scope.latitude,$scope.longitude);
				myLocation.setPosition(latlng);
				myLocation.setVisible(true);
		        $scope.map.setCenter(latlng);
		        
		        var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
		        $http.get(httpz).success(function(data){
		        	$scope.full_address = data.results[0].formatted_address;
		        	
		        });
		        var log = 0;
		        Search.remove();
		        Search.addLoc($scope.latitude,$scope.longitude);
		        Search.setType("0");
				angular.forEach(areaJson, function(value,key){
					angular.forEach(value.outlet,function(value1,key1){
						var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
						var pathPoly = new google.maps.Polygon({
							path: pathArray
						});
						if(google.maps.geometry.poly.containsLocation(new google.maps.LatLng($scope.latitude,$scope.longitude),pathPoly)) {
						    log++;
						    Search.addOutlet(value1.id);
						}				
					});
				});
				$scope.areaCoverage = log;
				$scope.hide();
			});
		}
		else {
			$scope.hide();
		}
	});

	$scope.searchAddress = function() {
		$scope.searchInput = true;
	};
});

app.controller('locationCtrl',function($scope,$http,$ionicLoading,Search,$location,Customer) {
	var areaJson = {};
	$scope.searchInput = true;
	Search.init();
	Search.setType("0");
	$scope.areaCoverage = 0;
	$scope.latitude = -6.219260;
	$scope.longitude = 106.812410;
	var log = 0;
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};
	$scope.show();
	$http.get("http://backoffice.satudelivery.com/protected/ordering/area.json").success(function(data){
        areaJson = data; 
		$scope.hide();
	});
	
	var mapOptions = {	center: new google.maps.LatLng($scope.latitude,$scope.longitude),
					 	zoom : 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false
					 };

	$scope.map =  new google.maps.Map(document.getElementById('map'), mapOptions);
	var myLocation = new google.maps.Marker({
		            position: new google.maps.LatLng($scope.latitude,$scope.longitude),
		            map: $scope.map,
					draggable: true,
		            title: "My Location"
				});
	var input = document.getElementById('addr_input');
	var autooption = {
		componentRestrictions : { country: 'id' }
	};
	var autocomplete = new google.maps.places.Autocomplete(input,autooption);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		myLocation.setVisible(false);
		var place = autocomplete.getPlace();
		var latlng = place.geometry.location;
		$scope.latitude = latlng.lat();
		$scope.longitude = latlng.lng();
		$scope.map.setCenter(latlng);
		myLocation.setPosition(latlng);
		myLocation.setVisible(true);
		log = 0;
		Search.remove();
		Search.addLoc($scope.latitude,$scope.longitude);
		Search.setType("0");
		angular.forEach(areaJson, function(value,key){
			angular.forEach(value.outlet,function(value1,key1){
				var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
				var pathPoly = new google.maps.Polygon({
					path: pathArray
				});
				if(google.maps.geometry.poly.containsLocation(latlng,pathPoly)) {
				    log++;
				    Search.addOutlet(value1.id);	
				}				
			});
		});
		$scope.areaCoverage = log;
		$scope.$apply();
	});
	
	google.maps.event.addListener(myLocation,'dragend',function(){
		var latlng = myLocation.getPosition();
		$scope.latitude = latlng.lat();
		$scope.longitude = latlng.lng();
		$scope.map.setCenter(latlng);	
		var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
		$http.get(httpz).success(function(data){
		   	$scope.full_address = data.results[0].formatted_address;
		});
		log = 0;
		Search.remove();
		Search.addLoc($scope.latitude,$scope.longitude);
		Search.setType("0");
		angular.forEach(areaJson, function(value,key){
			angular.forEach(value.outlet,function(value1,key1){
				var pathArray = google.maps.geometry.encoding.decodePath(value1.area);
				var pathPoly = new google.maps.Polygon({
					path: pathArray
				});
				if(google.maps.geometry.poly.containsLocation(latlng,pathPoly)) {
				    log++;
				    Search.addOutlet(value1.id);
				}				
			});
		});
		$scope.areaCoverage = log;
	});
});

app.controller('cartCtrl',function($scope,$http,$stateParams,$ionicModal,$ionicLoading,Cart,Customer,$location,$ionicPopup) {
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	Cart.init($scope.outlet_id);
	$scope.data = {};
	$scope.data.datetimetype = 1;
	$scope.data.datetime = new Date();
    var momentz = moment($scope.data.datetime);
    Cart.updateTime($scope.data.datetimetype,momentz.unix());
	$scope.min_hit = false;

	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
	
	$scope.items = Cart.getAll();
	var totalItems = Cart.getTotalItems();
	if(totalItems == 0)
		$location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id+"/");
	
	var totalPrice = 0;
	angular.forEach($scope.items,function(value,key){
		var price_ea = parseInt(value.menu_price);
		if(value.size_id) {
			price_ea = parseInt(value.size_id.size_price);
		}
		totalPrice += parseInt(value.qty) * price_ea;
		if(value.attr) {
			angular.forEach(value.attr,function(value1,key1) {
				totalPrice += parseInt(value1.attribute_price) * parseInt(value.qty);
			});
		}
	});

	$scope.totalPrice = totalPrice;
	$scope.totalItems = totalItems;

	var urlz = url + "/getFees.php?outlet_id="+$scope.outlet_id+"&brand_id="+$scope.brand_id+"&callback=JSON_CALLBACK";
	$http.jsonp(urlz).success(function(data){
		$scope.tax_service_charge = data.charge.tax_service_charge;
		$scope.delivery_fee = data.charge.delivery_fee;
		$scope.min_transaction = data.charge.min_transaction;
		Cart.updatePrice($scope.tax_service_charge,$scope.delivery_fee);
		$scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + $scope.delivery_fee;
		if($scope.totalPrice > $scope.min_transaction)
			$scope.min_hit = true;
	});


	$scope.editItem = function(index) {

	};

	$scope.deleteItem = function(index) {
		Cart.removeItem(index);
		$scope.items = Cart.getAll();
		var totalItems = Cart.getTotalItems();
		$scope.totalPrice = Cart.getTotalPrice();
		$scope.totalItems = totalItems;
		if(totalItems == 0)
			$location.path("/order/"+$scope.outlet_id+"/"+$scope.brand_id+"/");
		$scope.grandtotal = ($scope.totalPrice*$scope.tax_service_charge/100) + $scope.totalPrice + $scope.delivery_fee;
		if($scope.totalPrice > $scope.min_transaction)
			$scope.min_hit = true;
		else
			$scope.min_hit = false;
	};

	$ionicModal.fromTemplateUrl('datetime-template.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

	$scope.$on('$destroy', function () {
		$scope.modal.remove();
	});
	
	$scope.openModal = function (){
		$scope.modal.show();
  	};
  	$scope.closeModal = function() {
		$scope.data.datetimetype = 1;
		$scope.data.datetime = new Date();
    	$scope.modal.hide();
    	var momentz = moment($scope.data.datetime);
    	Cart.updateTime($scope.data.datetimetype,momentz.unix());
  	};
	$scope.saveModal = function() {
		$scope.data.datetimetype = 2;
    	$scope.modal.hide();
    	var momentz = moment($scope.data.datetime);
    	Cart.updateTime($scope.data.datetimetype,momentz.unix());
  	};
  	$scope.showAlert = function() {
	   var alertPopup = $ionicPopup.alert({
	     title: 'Mininum Order',
	     template: 'Minimum Order untuk Delivery tidak Tercapai'
	   });
	};
  	$scope.toCheckout = function() {
  		if(Customer.isLogged()) {
  			$location.path('/checkout/'+$scope.outlet_id+'/'+$scope.brand_id);
  		}
  		else {
  			$location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
  		}
  	};
});

app.controller('checkoutCtrl',function($scope,$http,$stateParams,$ionicPopup,$ionicLoading,Cart,Search,$location,Customer) {
	$scope.outlet_id = $stateParams.outlet_id;
	$scope.brand_id = $stateParams.brand_id;
	$scope.logged_in = Customer.isLogged();
	$scope.addressInput = {};
	$scope.deliveryInstruction = {};
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    	$location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
    });
    if($scope.logged_in == false) {
    	$location.path('/login-mid/'+$scope.outlet_id+'/'+$scope.brand_id);
    }
	Cart.init($scope.outlet_id);
	$scope.items = Cart.getAll();
	$scope.totalPrice = parseInt(Cart.getTotalPrice());
	$scope.totalItems = Cart.getTotalItems();
	$scope.tax_service_charge = Cart.getTaxCharge()/100 * $scope.totalPrice;
	$scope.delivery_fee = parseInt(Cart.getDeliveryFee());
	$scope.searchType = Search.getType();
	if($scope.searchType > 0) {
		$scope.addr = Customer.getAddressById($scope.searchType);
	}
	else {
		$scope.addressInput.address_selection = 1;
	}

	$scope.saveAddress = function(address) {
		$scope.addressInput.latitude = Search.getLat();
		$scope.addressInput.longitude = Search.getLng();
		$scope.addressInput.customer_id = Customer.getCustomerID();

		$http({
		    url: url + "/saveAddress.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: $scope.addressInput
		})
		.then(function(response) {
			if(response.data.address_id > 0) {
				Customer.setAddress(response.data.address);
				Search.setType(response.data.address_id);
				$scope.searchType = response.data.address_id;
				$scope.addr = Customer.getAddressById($scope.searchType);
			}
		});

	};

	$scope.placeOrder = function(){
		var test ={};
		test.items = Cart.getAll();
		test.customer_id = Customer.getCustomerID();
		test.address_id = $scope.searchType;
		test.outlet_id = $scope.outlet_id;
		test.brand_id = $scope.brand_id;
		test.tax_service_charge = $scope.tax_service_charge;
		test.delivery_fee = $scope.delivery_fee;
		test.deliveryInstruction = $scope.deliveryInstruction.data;
		test.payment_method = "cash";
		test.subtotal = Cart.getTotalPrice();
		test.order_type = Cart.getDeliveryType();
		test.order_datetime = Cart.getDeliveryTime();
		//console.log(test);
		
		$http({
		    url: url + "/placeOrder.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: test
		})
		.then(function(response) {
			var order_id = response.data;
			//console.log(order_id);
			if(order_id > 0) {
				$location.path('/confirmation/'+order_id);
			} else {

			}
		});
		
	};
});


app.controller('newAddressCtrl',function($scope,$http,$ionicLoading,$ionicModal,$location,Customer) {
	$scope.newAddress = [
		{ index : 1, text : "Get Your Location",checked : false},
		{ index : 2, text : "Extra Guidance or Instructions", checked : false},
		{ index : 3, text : "Address Detail",checked : false}
	];
	$scope.tab = {};
	$scope.addressInput = { 'address_selection' : 1 };
	$scope.latitude = -6.219260;
	$scope.longitude = 106.812410;

	$scope.show = function() {
	    $ionicLoading.show({
	      template: 'Loading...'
	    });
	};
	$scope.hide = function(){
	    $ionicLoading.hide();
	};

	var mapOptions = {	center: new google.maps.LatLng($scope.latitude,$scope.longitude),
					 	zoom : 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						streetViewControl: false
					 };

	$ionicModal.fromTemplateUrl('newaddress-template.html', {
	  	scope: $scope,
	  	animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;	
	});

	$scope.$on('$destroy', function () {
		$scope.modal.remove();
	});
	
	$scope.openModal = function (tab){	
		$scope.tab = tab;
		$scope.modal.show();
		
		if($scope.tab == 1) {
		$scope.map =  new google.maps.Map(document.getElementById('map'), mapOptions);
			var myLocation = new google.maps.Marker({
			            position: new google.maps.LatLng($scope.latitude,$scope.longitude),
			            map: $scope.map,
						draggable: true,
			            title: "My Location"
			});
			if(navigator.geolocation) {
				myLocation.setVisible(false);
		    	navigator.geolocation.getCurrentPosition(function(position) {
					$scope.latitude = position.coords.latitude;
			        $scope.longitude = position.coords.longitude;
			        $scope.accuracy = position.coords.accuracy;
			        $scope.$apply();
					
					var latlng = new google.maps.LatLng($scope.latitude,$scope.longitude);
					myLocation.setPosition(latlng);
					myLocation.setVisible(true);
			        $scope.map.setCenter(latlng);
			        
			        var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
			        $http.get(httpz).success(function(data){
			        	$scope.full_address = data.results[0].formatted_address;       	
			        });
					$scope.newAddress[0].checked = true;
				});
			}
			google.maps.event.addListener(myLocation,'dragend',function(){
				var latlng = myLocation.getPosition();
				$scope.latitude = latlng.lat();
				$scope.longitude = latlng.lng();
				$scope.map.setCenter(latlng);	
				var httpz = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+$scope.latitude+","+$scope.longitude+"&key=AIzaSyDwb8lxMiMVIVM4ZQ98RssfumMr8Olepzw";
				$http.get(httpz).success(function(data){
				   	$scope.full_address = data.results[0].formatted_address;
				});
			});
		}
  	};
  	$scope.closeModal = function() {
    	$scope.modal.hide();
  	};
	$scope.saveAddress = function(address) {
		address.latitude = $scope.latitude;
		address.longitude = $scope.longitude;
		if(address.patokan)
			$scope.newAddress[1].checked = true;
		if(address.address_content) 
			$scope.newAddress[2].checked = true;
    	$scope.modal.hide();
  	};
  	$scope.commitAddress = function() {
  		$scope.addressInput.customer_id = Customer.getCustomerID();
  		$http({
		    url: url + "/saveAddress.php",
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		    data: $scope.addressInput
		})
		.then(function(response) {
			if(response.data.address_id > 0) {
				Customer.setAddress(response.data.address);
			}
		});
  		$location.path('/my-address');
  	}
});

app.controller('confirmationCtrl',function($scope,$http,$ionicLoading,$location,$stateParams,Customer) {
	$scope.order_id = $stateParams.order_id;
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
    $scope.customer_email = Customer.getCustomerEmail();
});


app.controller('faqCtrl',function($scope,$location,$stateParams,$ionicNavBarDelegate){
	$scope.section = $stateParams.page;
	$scope.gozBack = function() {
		$location.path('#/faq/');
	};
});

app.controller('feedbackCtrl',function($scope,$location,$stateParams,Customer,$http){
	$scope.logged_in = Customer.isLogged();
	$scope.$on('state.update', function () {
    	$scope.logged_in = false;
    });
    $scope.$on('state.login', function () {
    	$scope.logged_in = true;
    });
	if($scope.logged_in == true)
	{
		$scope.customer = Customer.getCustomer();
		$scope.support = {};
		$scope.success_login = false;
		$scope.support.name = $scope.customer.customer_name;
		$scope.support.email = $scope.customer.customer_email;
		$scope.support.type = "support";

		$scope.submitSupport = function(form) {
			$http.defaults.useXDomain = true;
			$http({
			    url: url + "/feedback.php",
			    method: "POST",
			    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
			    data: $scope.support
			})
			.then(function(response) {
				console.log(response.data);

			});

			form.$setPristine();
	      	form.$setUntouched();
			$scope.success_login = true;
			$scope.support.message = "";
		};
	} 
});