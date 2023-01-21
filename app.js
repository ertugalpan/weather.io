const { response } = require("express");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//  Get the html file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//  Get the data from the form
app.post("/", function (req, res) {
  console.log(req.body.cityName);

  //   Return the data from the API
  const unit = "metric";
  const apiKey = "45739022177c022502bba76d471322cc";
  const query = req.body.cityName;
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  //   Return  whole API data
  https.get(url, function (response) {
    console.log(response.statusMessage);
    console.log(response.statusCode);

    // Divide data into chunks
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      // Get the temperature from the API
      const temp = weatherData.main.temp;

      // Get the weather description from the API
      const weatherDescription = weatherData.weather[0].description;

      //   Get the icon code from the API
      const icon = weatherData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + ".png";

      //   Write the html code to display the weather data
      res.write("<h1>The weather is currently " + weatherDescription + "</h1>");
      res.write("<img src=" + imageUrl + ">");
      res.write(
        "<h1>The temperature in " +
          query +
          " is " +
          temp +
          " degrees Celcius.</h1>"
      );

      res.send();
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
