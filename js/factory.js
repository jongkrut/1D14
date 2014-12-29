angular.module('cart',[]).factory('Cart',function(){
	var cart = {
		outlet_id : '',
		tax_service_charge : '',
		delivery_charge : '',
		grandtotal : '',
		init: function(outlet){
			outlet_id = outlet;
			if(localStorage.getItem("cart-"+outlet_id) == null)
				localStorage.setItem("cart-"+outlet_id,JSON.stringify([]));
		},
		getAll: function(){
			return JSON.parse(localStorage.getItem("cart-"+outlet_id));
		},
		getTotalItems: function(){
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			var total = 0;
			for(var i = 0; i < items.length;i++){
				total = total + parseInt(items[i].qty);
			}
			return total;
		},
		getTotalPrice: function(){
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			var total = 0;
			var attr_total = 0;
			for(var i = 0; i < items.length;i++){
				if(items[i].size_id == undefined) {
					total = total + (parseInt(items[i].qty) * parseInt(items[i].menu_price));
				} else {
					total = total +  (parseInt(items[i].qty) * parseInt(items[i].size_id.size_price));
				}
				if(items[i].attr !== undefined) {
					for(var j = 0; j < items[i].attr.length ; j++){
						attr_total += (parseInt(items[i].qty) * parseInt(items[i].attr[j].attribute_price));
					}	
				}
			}
			return (total+attr_total);
		},
		getTaxCharge:function(){
			return localStorage.getItem("tsc-"+outlet_id);
		},
		getDeliveryFee: function(){
			return localStorage.getItem("delfee-"+outlet_id);
		},
		addItem: function(item) {
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			items.push(item);
			localStorage.setItem("cart-"+outlet_id,JSON.stringify(items));
		},
		removeItem: function(index){
			var items = JSON.parse(localStorage.getItem("cart-"+outlet_id));
			items.splice(index,1);
			localStorage.setItem("cart-"+outlet_id,JSON.stringify(items));
		},
		updatePrice : function(tsc,delfee){
			tax_service_charge = tsc;
			delivery_charge = delfee;
			localStorage.setItem("delfee-"+outlet_id,delfee);
			localStorage.setItem("tsc-"+outlet_id,tsc);
		},
		updateTime : function(type,datetime) {
			localStorage.setItem("datetype-"+outlet_id,type);
			localStorage.setItem("datetime-"+outlet_id,datetime);
		},
		getDeliveryType:function(){
			return localStorage.getItem("datetype-"+outlet_id);
		},
		getDeliveryTime: function(){
			return localStorage.getItem("datetime-"+outlet_id);
		}
	}
	return cart;
});

angular.module('search',[]).factory('Search',function(){
	var cart = {
		items : '',
		latitude : '',
		longitude : '',
		type : '',
		init: function(){
			localStorage.setItem("search",JSON.stringify([]));
			localStorage.setItem("latitude","");
			localStorage.setItem("longitude","");
		},
		getAll: function(){
			return localStorage.getItem("search");
		},
		addOutlet: function(outlet) {
			var items = JSON.parse(localStorage.getItem("search"));
			items.push(outlet);
			localStorage.setItem("search",JSON.stringify(items));
		},
		remove: function(){
			localStorage.setItem("search",JSON.stringify([]));
			localStorage.setItem("latitude","");
			localStorage.setItem("longitude","");
			localStorage.removeItem("search-type");
		},
		setType : function(type) {
			localStorage.setItem("search-type",type);
		},
		addLoc: function(lat,lng) {
			localStorage.setItem("latitude",lat);
			localStorage.setItem("longitude",lng);
		},
		getLat : function() {
			return localStorage.getItem("latitude");
		},
		getLng : function(){
			return localStorage.getItem("longitude");
		},
		getType : function(){
			return localStorage.getItem("search-type");
		}
	}
	return cart;
});

angular.module('customer',[]).factory('Customer',function($rootScope){
	var cart = {
		customer : '',
		address : '',
		init: function(customer){
			localStorage.setItem("customer",JSON.stringify(customer));
			localStorage.setItem("customer_address",JSON.stringify([]));
		},
		getCustomerID : function(){
			customer = JSON.parse(localStorage.getItem("customer"));
			return customer.customer_id;
		},
		setAddress: function(address) {
			localStorage.setItem("customer_address",JSON.stringify(address));
		},
		getCustomer: function() {
			return JSON.parse(localStorage.getItem("customer"));
		},
		getAddress: function() {
			return JSON.parse(localStorage.getItem("customer_address"));
		},
		getAddressByIndex:function(index){
			var address = JSON.parse(localStorage.getItem("customer_address"));
			return address[index];
		},
		getAddressById:function(id){
			address = JSON.parse(localStorage.getItem("customer_address"));
			if(address == null) {
				return "";
			} else {
			var addr = "";
				for(var i = 0; i < address.length;i++){
					if(address[i].address_id == id) {
						addr = address[i];
						break;
					}
				}
				return addr;
			}
		},
		getDefaultAddress : function(){
			address = JSON.parse(localStorage.getItem("customer_address"));
			if(address == null) {
				return "";
			} else {
				var addr = "";
				for(var i = 0; i < address.length;i++){
					if(address[i].default_address == 1) {
						addr = address[i];
						break;
					}
				}
				return addr;
			}
		},
		logout: function(){
			localStorage.removeItem("customer");
			localStorage.removeItem("customer_address");
			$rootScope.$broadcast('state.update');
		},
		isLogged : function(){
			if(localStorage.getItem("customer") == null)
				return false;
			else
				return true;
		}
	}
	return cart;
});