var express = require('express');
var _ = require('underscore');
var app = express();

// Global app configuration section.
app.use(express.bodyParser());

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');

// Register request handlers for each route.
app.get('/hello/:msg', function(req, res) {

    res.render("hello", {name: req.query.name, msg: req.params.msg}, function(err, html) {
        // err is set if template rendering failed.
        // html is the output string produced by rendering the template.

        res.send(html); // You need to send the response manually.
    });
});

app.get('/test', function(request, response){
   response.redirect('/html/index.html', 301);
});

app.listen();