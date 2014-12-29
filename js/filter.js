angular.module('sdfilters',[]).filter('foodpermit',function(){
	return function(input) {
		var out = "Non-Halal";
		if (input == 1) {
		  out = "Halal";
		}
		return out;
	};
}).filter('outletname',function(){
	return function(input,location) {
		if (!input || !input.length) { return; }
		var splitted = input.split('@');
		if(location)
			return splitted[1];
		else
			return splitted[0];
	};
});