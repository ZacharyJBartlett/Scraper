var express = require("express");
var exph = require("express-handlebars");
var mongoose = require("mongoose");
var bp = require("body-parser");
var logger = require("morgan");
var request = require("cheerio");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();

app.use(logger("dev"));
app.use(bp.urlencoded({
    extended:false
}));


app.use(express.static("public"));

mongoose.connect("mongodb://localhost/scraper");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.get("/scrape", function(req, res) {
    request("http://www.theonion.com/", function(error, response, html) {
        var $ = cheerio.load(html);

        $("handler a").each(function(i, element) {
            
            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            var entry = new Article(result);

            entry.save(function(err, doc) {
                if (err) {
                    consol.log(err);
                }
                else {
                    console.log(doc);
                }
            });;
        });
    });
    res.send("Scrape Complete");
});