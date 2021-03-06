var express = require('express'),
  stylus = require('stylus'),
  jade = require('jade'),
  fs = require('fs');

var app = express();

app.configure( function(){
  app.set('view engine', 'jade');
});


var linkify;

(function(){
    var replacements = {}; /*{
      'libcloud': 'http://libcloud.apache.org/',
      'Node Knockout': 'http://nodeknockout.com/',
      'Jade': 'http://jade-lang.com/',
      'Stylus': 'http://learnboost.github.com/stylus/',
      'International Baccalaureate': 'http://ibo.org',
      'Sphinx': 'http://sphinx.pocoo.org/',
      'Kafka': 'https://kafka.apache.org/',
      'InGraphs': 'http://engineering.linkedin.com/32/eric-intern-origin-ingraphs',
      'dustjs': 'http://linkedin.github.com/dustjs/'
    };*/
    var r_str = '';
    for(var r in replacements){
      r_str += r + '|';
    }
    r_str = r_str.substring(0, r_str.length-1);
    var re = new RegExp(r_str, 'g');

  linkify = function (data) {
    return data.replace(re, function(match) {
      var r = replacements[match];
      if(r !== undefined){
        return '<a href="' + r + '">' + match + '</a>';
      } else {
        return match;
      }
    });
  };

})();

app.get('/', function(req, res) {
  fs.readFile(__dirname + '/resume.jade', function(err, data){
    if(err) throw err;
    data = (jade.compile(data))();
    data = linkify(data);
    fs.writeFile(__dirname + '/resume.html', data);
    res.send(data);
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});
