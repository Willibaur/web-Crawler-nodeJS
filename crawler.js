var request = require('request');
var cheerio = require('cheerio');
var URL     = require('url-parse');

var pageToVisit = "https://gocardless.com";

console.log("Visiting page " + pageToVisit);

request(pageToVisit, function (error, response, body) {
  if (error) {
    console.log("Error: " + error);
  }

  console.log("Status code: " + response.statusCode);

  if(response.status === 200) {
    var $ = cheerio.load(body);
    console.log("Page title: " + $('title').text());
  }
});
