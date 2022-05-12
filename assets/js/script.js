'use strict';
// Setting up moment
var today = moment();
var todaysDate = today.format("dddd, MMM DD");

// Main Weather Section

var contentContainer = $("#content2-container");
var submitButton = $("#submit");
var cityDate = $("#city-date");
var temp = $("#temp");
var humidity = $("#humidity");
var windSpeed = $("#wind-speed");
var uvIndex = $("#uv-index");
var icon = $("#icon");

// Setup Initialized State

var searchedCityContainer = $("#list-group");
var savedCitiesJSON = localStorage.getItem("cities");
var savedCities = savedCitiesJSON ? JSON.parse(savedCitiesJSON): [];
if (savedCities.length){
handleAPI(savedCities[savedCities.length -1]);
}
for (var i = 0; i < savedCities.length; i++){
    searchedButton(savedCities[i]);
}


// One Call API

function uvIndexHandler (lon, lat){
    var APIKey = "f4299bef35c7fb3410eeb230e66758d1";
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly&appid=" + APIKey;

    $.ajax({   
        url: queryURL,
        method: "GET"
    }).then(function(response2){
        var uvIndexNumber = response2.current.uvi;
        uvIndex.text( "UV-Index: " + uvIndexNumber);
        if (uvIndexNumber <= 2 || uvIndex <= 0){
            $(uvIndex).addClass("good");
        }
        else if (uvIndexNumber <= 6){
            $(uvIndex).addClass("moderate");
        }
        else {
            $(uvIndex).addClass("severe");
        }
        //Empty Container before each submit
        contentContainer.empty();
        for (var i = 1; i < 6; i++){
            //5 Day Foercast Section
            var fiveDayContainer = $('<div id="fiveDayWeather" class="card p-2 bg-primary text-light col-sm row m-1">');
            var fiveCityDate = $('<p id="five-city-date">');
            var fiveCityIcon = $('<img id="icon2" src="" class="col-9"></img>');
            var fiveCityTemp = $('<p id="five-city-temp">');
            var fiveCityHumidity = $('<p id="five-city-humidity">');

            // Append 5 Day Section
            contentContainer.append(fiveDayContainer);
            fiveDayContainer.append(fiveCityDate, fiveCityIcon, fiveCityTemp, fiveCityHumidity);
            
            // Setting up Date

            var newDate = moment().add(i, 'days');
            var nextDate = newDate.format("dddd, MMM DD");

            // Setting up Responses
            fiveCityDate.text("Date: " + nextDate);
            fiveCityTemp.text("Temp: " + response2.daily[i].temp.day + " F");
            fiveCityHumidity.text("Humidity: " + response2.daily[i].humidity + "%");

            //Setting up Icons
            var iconCode2 = response2.daily[i].weather[0].icon;
            var iconURL2 = "http://openweathermap.org/img/wn/" + iconCode2 + "@2x.png";
            fiveCityIcon.attr("src", iconURL2);
        }
    });
}

// Append List of Searches

function searchHandler(city){
    savedCities.push(city);
    localStorage.setItem("cities", JSON.stringify(savedCities));
    searchedButton(city);
}
// Append search buttons
function searchedButton (city){
    var searchedCity = $('<button class="list-group-item"></button>');
    searchedCityContainer.append(searchedCity);
    searchedCity.text(city);
    searchedCity.data("city", city);
}

//Setting up API handler

function handleAPI(city){
    
    var APIKey = "f4299bef35c7fb3410eeb230e66758d1";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        var iconCode = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        var weatherIcon = icon.attr("src", iconURL);
        cityDate.text( response.name + ", " + todaysDate);
        temp.text( "Temperature: " + response.main.temp + " F");
        humidity.text( "Humidity: " + response.main.humidity + "%");
        windSpeed.text( "Wind Speed: " + response.wind.speed + " MPH");

        var lon = response.coord.lon;
        var lat = response.coord.lat;

        uvIndexHandler(lon, lat);

});
}

 searchedCityContainer.on("click", ".list-group-item", function (event){
     event.preventDefault();
    handleAPI($(this).data("city"));
 })


submitButton.on("click", function (event) {
    event.preventDefault();
    var city = $("#input").val().trim();
    searchHandler(city);
    handleAPI(city);
  });