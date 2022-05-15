const express = require("express");
const app = express();
// https is a native node module so we can exclude the node prefix
const https = require("https");
// body-parser npm package is used to obtain post data and make it functional within .js
const bodyParser = require("body-parser");


// for each app.methods, we can ONLY have 1 .send().
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Necessary code to parse user input
app.use(bodyParser.urlencoded({extended: true}));

// when we post something on '/' page, we proc our callBack
app.post("/", function(req, res){
  console.log("post recieved");

  // query variable is set to what user posted/requested(user input)
  const query = req.body.cityName;
  const apiKey = "59ec192e67710a8235f76d6fdc6e98ec";
  const units = "metric";

  // URL of API is manipulated so it is shortened and adapted to what the user requested
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +
  "&units="+ units +"&appid="+apiKey;

  //https obtains the URL raw .json file
  https.get(url, function(response) {
    // diagnostic code to display the status code of the raw .json
    console.log(response.statusCode);

    // Our parent callback function responds to data(obtained by https) and parses the raw .JSON
    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      // Specific .json attributes are selected using paths
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      // Diagnostic code to display temperature and description of weather
      console.log(temp);
      console.log(description);

      var weatherDesc = "The weather is currently " + description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon +"@2x.png";
      // Option 1: Sending a large string to client side
      // res.send("<h1>The temperature in Toronto is " + temp +
      //         " degrees celsius.</h1><n>" + weatherDesc);

      // Alternatively,
      res.write("<h1>The temperature in "+ query +" is " + temp + " degrees celsius</h1>");
      res.write("<p>" + weatherDesc + "</p>");
      res.write("<img src=' " + imageURL + "'>")
      res.send();
    });
  });
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
})
