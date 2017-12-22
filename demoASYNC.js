var async = require('async');
var express = require('express');
var app = express();
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

app.get('/', function(req, response, next) {
  var cnodeUrl = 'https://cnodejs.org/';
  superagent.get(cnodeUrl)
    .end(function(err, res) {
      if (err) {
        return next(err);
      }
      var concurrencyCount = 0;
      var fetchUrl = function(url, callback) {
        // var delay = parseInt((Math.random() * 10000000) % 2000, 100);
        concurrencyCount++;
        console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + 3000 + '毫秒');
        setTimeout(function() {
          concurrencyCount--;
          callback(url + ' html content');
        }, 3000);
      };
      var topicUrls = [];
      // res.text==>html
      var $ = cheerio.load(res.text);
      $('#topic_list .topic_title').each(function(idx, element) {
        // url.resolve 整合成一个完整的链接地址
        var $element = $(element);
        var href = url.resolve(cnodeUrl, $element.attr('href'));
        topicUrls.push(href);
      });
      async.mapLimit(topicUrls, 5, function(url, callback) {
        fetchUrl(url, callback);
      }, function(err, result) {
        console.log(err);
        console.log(result);
      });
    });
});

app.listen(1000, function() {
  console.log('app is running at port 1000');
});
