var request = require('request');
var cheerio = require('cheerio');
var URL     = require('url-parse');


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " URL");
    process.exit(-1);
}

var START_URL           = process.argv[2];
var MAX_PAGES_TO_VISIT  = 100;

var pagesVisited    = {};
var numPagesVisited = 0;
var pagesToVisit    = [];

var url     = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;

pagesToVisit.push(START_URL);
crawl();

function crawl() {
  if(numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    console.log(pagesVisited);
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    crawl();
  } else {
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  pagesVisited[url] = true;
  numPagesVisited++;

  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
     if(response.statusCode !== 200) {
       callback();
       return;
     }

     // Parse the document body
     var $ = cheerio.load(body);
       collectInternalLinks($);
       callback();
  });
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    relativeLinks.each(function() {
        pagesToVisit.push(baseUrl + $(this).attr('href'));
    });
}
