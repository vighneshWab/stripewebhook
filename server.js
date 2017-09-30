// server.js
var express = require("express");
// var bodyParser = require("body-parser");
var bodyParser = require('body-parser').json();

var stripe = require('stripe')("sk_test_o582mFkZFmS94mvRLtlhWcFx");
// stripe.setTimeout(20000);

var app = express();
// app.use(bodyParser.json());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.set('port', (process.env.PORT || 8080));

var server = app.listen(app.get('port'), function () {
    // var port = server.address().port;

    console.log("App now running on port", new Date().toLocaleString());
});


// apis end points will be here

app.get('/', function (req, res) {
    res.send('connection succesfully');
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}


app.get('/customer', function (req, res) {
    console.log('/customer');
    res.send({ 'test': 'comepeplted' });


})

app.post('/customer', bodyParser, function (req, res) {
    console.log('customer', JSON.stringify(req.body))
    res.send({ 'test': 'comepeplted', 'param': req.body });
    stripe.customers.create({
        email: req.body.email
    }, function (err, success) {
        if (err) {
            console.log('error', err)
            res.send({ 'status': false, "err": err });
        }
        if (success) {
            console.log('success')
            // res.status(201).json(doc.ops[0]);
            res.send({ 'status': true, "success": success });
        }

    });
});