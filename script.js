var getBackground = function(wid) {
	//pre: weather id (int)
	//post: returns the background image to use

	if (wid < 300) {
		//thunderstorm
		return "https://upload.wikimedia.org/wikipedia/commons/a/a4/Cloud_to_ground_lightning_strikes_south-west_of_Wagga_Wagga.jpg";
	} else if (wid < 400) {
		//drizzle
		return "http://img07.deviantart.net/ea88/i/2012/198/6/b/drizzle__by_niki91-d57kcpt.jpg"
	} else if (wid < 600) {
		//rain
		return "http://wearechange.org/wp-content/uploads/2015/03/1_See_It.jpg";
	} else if (wid < 700) {
		//snow
		return "http://feelgrafix.com/data_images/out/15/889722-snow-wallpaper.jpg"
	} else if (wid < 800) {
		//atmosphere
		return "http://www.chrishoneysett.com/data/photos/176_1trees_in_fog_study_9.jpg"
	} else if (wid == 800) {
		//clear
		return  "http://static.squarespace.com/static/53bd3460e4b07d8e4ad42994/t/53d05575e4b0b1c1fde219b1/1406162293119/wallpapers-sky-clear-grasslands-hd-1280x800.jpg"
	} else if (wid < 900) {
		//clouds
		return "https://www.google.com/search?q=cloudy&newwindow=1&safe=active&client=ubuntu&hs=K80&channel=fs&source=lnms&tbm=isch&sa=X&ved=0ahUKEwjGsIeZwJbKAhVBKB4KHeu3CzoQ_AUIBygB&biw=1301&bih=639#imgrc=hiey5gwUdTlM7M%3A"
	} else if (wid < 910) {
		//extreme!
		return "http://kids.nationalgeographic.com/content/dam/kids/photos/articles/Science/Q-Z/tornado.jpg"
	} else {
		//additional
		return "https://i.ytimg.com/vi/0_jNjpVxUt0/maxresdefault.jpg"
	}

}

var getFahrenheit = function(k){
	//pre: k (int) is temperature in kelvins
		//k >= 0
	//post: returns temp in fahrenheit
	var raw_temp = (9 / 5 * (k - 273) + 32);
	var rounded = Math.round(raw_temp);
	return rounded + " F";
}

var getCelsius = function(k){
	//pre: k (int) is temperature in kelvins
		//k >= 0
	//post: returns temp in celsius

	raw_temp = k - 273;
	var rounded = Math.round(raw_temp);
	return rounded + " C";
}

var convertWindSpeed = function(ms) {
	//pre: ms > 0
	//post: converts m/s to miles/hour

	return Math.round(ms * 2.2369);
}

var toggleTemp = function(){
	//pre: none
	//post: changes #temp.text() to the other temp unit

	console.log("inside toggle temp!")

	if ($("#temp").hasClass("show_f")) {
		//toggle to celsius	
		$("#temp").removeClass("show_f");
		$("#temp").addClass("show_c");
		$("#temp").text(getCelsius($("#temp").attr("kelvins")));


	} else {
		//toggle to fahrenheit
		$("#temp").removeClass("show_c");
		$("#temp").addClass("show_f");
		$("#temp").text(getFahrenheit($("#temp").attr("kelvins")));
	}
}

var toggleSpeed = function() {
	//pre: none
	//post: changes #wind.text() to the other speed unit

	var element = $("#wind");
	var class_list = element.className.split(/\s+/);
	if (class_list.indexOf("show_imp") > -1) {
		//toggle to metric	
		element.remomveClass("show_imp");
		element.addClass("show_metric");
		element.text(convertWindSpeed(element.attr("ms")));


	} else {
		//toggle to fahrenheit
		element.remomveClass("show_c");
		element.addClass("show_f");
		element.text(getFahrenheit(element.attr("kelvins")));
	}
}

var getWeather = function(url) {
	//pre: api request url
	//post: json response returned
	$.getJSON(url, function(json) {
		buildPage(json);
	});
}

var buildPage = function(json) {
	//pre: json of weather data
	//post: page is built based on this dat

	//restore state incase we are reloading
	$(".container").hide()
	$("#temp").unbind("click")

	//set background
	var conditionID = json.weather[0]["id"]
	var backgroundLoc = getBackground(conditionID)
	$(".full").css("background", "url(" + backgroundLoc + ") no-repeat center center fixed" )

	var kelvins = json.main.temp; 
	var fahrenheit = getFahrenheit(kelvins);
	// var celsius = getCelsius(kelvins);

	console.log(JSON.stringify(json))
	//populate elements

	//temperture in k and unit displayed
	//is stored in the element itself.
	$("#temp").text(fahrenheit).attr("kelvins", kelvins).
	addClass("show_f");

	$("#temp").click(function() {
		console.log("temp div clicked")
		toggleTemp();
	})

	$("#city").text(json.name)
	$("#descrip").text(json.weather[0]["description"])

	//add image tag
	var icon_loc = "http://openweathermap.org/img/w/" + json.weather[0]["icon"] +".png";
	$("#icon").attr("src", icon_loc)

	//reveal elements when everything is ready
	$(".container").fadeIn(3000)

}

$(document).ready(function(){

	//hide container while we assemble
	$(".container").hide()

	//pre populate with data from San Fransisco

	var api_key = "85503591afa866896fc8bf685e4b1a53"
	var url = "http://api.openweathermap.org/data/2.5/weather?&appid="+api_key
	url += "&lat="+"37";
	url += "&lon="+"-122";
	getWeather(url);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			
			//build url
			var api_key = "85503591afa866896fc8bf685e4b1a53"
			var url = "http://api.openweathermap.org/data/2.5/weather?&appid="+api_key
			url += "&lat="+position.coords.latitude;
			url += "&lon="+position.coords.longitude;

			console.log(url);
			getWeather(url);

		})	
	} 
})