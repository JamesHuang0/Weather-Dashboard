$(document).ready(function () {

const apiKey = "6715bf9921bb459ccba15cd231d538d6";

    $("#search-button").on("click", function() {
        var city = $("#search").val();
        $("#search").val("");
        searchWeather(city);
        searchForecast(city);
    });

    var history = JSON.parse(localStorage.getItem("history")) || [];

    function addHistory(text) {
        var list = $("<li>").addClass("list-group-item").text(text);
        $(".search-history").append(list);
    }

    if (history.length > 0) {
        searchWeather(history[history.length - 1]);
    }

    for (var i = 0; i < history.length; i++) {
        addHistory(history[i]);
    }
    
    $(".search-history").on("click", "li", function() {
        searchWeather($(this).text());
        searchForecast($(this).text());
    });

    function searchWeather(city) {

        $.ajax({
            type: "get",
            url: "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+apiKey+"&units=imperial",
        
        }).then(function(data) {
            if (history.indexOf(city) === -1) {
                history.push(city);
                localStorage.setItem("history", JSON.stringify(history));
                addHistory(city);
            } 
            $("#current").empty();
        
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var card = $("<div>").addClass("card");
            var cardBody = $("<div>").addClass("card-body");
            var title = $("<h2>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
            var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
            var temp = $("<p>").addClass("card-text").text("Temp: " + data.main.temp + " °F");
            var wind = $("<p>").addClass("card-text").text("Wind: " + data.wind.speed + " MPH");
            var hum = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");   

            $.ajax({
                type: "get",
                url: "https://api.openweathermap.org/data/2.5/uvi?appid="+apiKey+"&lat="+lat+"&lon="+lon,

            }).then(function (response) {

                var uvResponse = response.value;
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: ");
                var btn = $("<span>").addClass("btn text-white").text(uvResponse);

                if (uvResponse > 7) {
                    btn.addClass("bg-danger");
                } else if (uvResponse > 3) {
                    btn.addClass("bg-warning");
                } else {
                    btn.addClass("bg-success");
                }

                cardBody.append(uvIndex);
                $("#current .card-body").append(uvIndex.append(btn));
            });
            
            title.append(img);
            cardBody.append(title, temp, wind, hum);
            card.append(cardBody);
            $("#current").append(card);
        }
    )};

    function searchForecast(city) {
        $.ajax({
            type: "get",
            url: "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apiKey+"&units=imperial",

        }).then(function(data){
            $("#5day").html("<h2 class=\"mt-3\">5-Day Forecast:</h2>").append("<div class=\"row\">");

            for (var i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {

                    var column5 = $("<div>").addClass("col-md-2 mx-auto");
                    var card5 = $("<div>").addClass("card bg-primary text-white");
                    var cardBody5 = $("<div>").addClass("card-body p-2");
                    var title5 = $("<h2>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
                    var img5 = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
                    var temp5 = $("<p>").addClass("card-text").text("Temp: " + data.list[i].main.temp + " °F");
                    var wind5 = $("<p>").addClass("card-text").text("Wind: " + data.list[i].wind.speed + " MPH");
                    var hum5 = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
    
                    column5.append(card5.append(cardBody5.append(title5, img5, temp5, wind5, hum5)));
                    $("#5day .row").append(column5);
                }
            }
        });
    }
})