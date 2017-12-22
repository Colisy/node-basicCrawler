var express = require('express');
var app=express();
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');


app.get('/', function (req, response, next) {
  var cnodeUrl = 'https://cnodejs.org/';
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
superagent.get(cnodeUrl)
  .end(function (err, res) {
    if (err) {
      return next(err);
    }
    var topicUrls = [];
    // res.text==>html
    var $ = cheerio.load(res.text);
    $('#topic_list .topic_title').each(function (idx, element) {
      // url.resolve 整合成一个完整的链接地址
      var $element = $(element);
      var href = url.resolve(cnodeUrl, $element.attr('href'));
      topicUrls.push(href);
    });
    var ep = new eventproxy();
    // ep.after()事件执行n次以后在执行callback
    ep.after('topic', topicUrls.length, function (topics) {
      // map（object,callback）
      topics = topics.map(function (topicPair) {
        var topicUrl = topicPair[0];
        var topicHtml = topicPair[1];
        var $ = cheerio.load(topicHtml);
        return ({
          title: $('.topic_full_title').text().trim(),
          href: topicUrl,
          comment1: $('.reply_content').eq(0).text().trim(),
        });
      });
      response.send(topics);
    });
    // 执行的事件
    topicUrls.forEach(function (topicUrl) {
      superagent.get(topicUrl)
        .end(function (err, res) {
          // console.log(topicUrl)
          ep.emit('topic', [topicUrl, res.text]);
        });
    });
  //
  });
});

app.listen(1000, function () {
  console.log('app is running at port 1000');
});
