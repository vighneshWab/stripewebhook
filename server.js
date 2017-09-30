// server.js


var express = require("express");
var bodyParser = require("body-parser");
var stripe = require('stripe')("sk_test_o582mFkZFmS94mvRLtlhWcFx");

var app = express();
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));





var server = app.listen(app.get('port'), function () {
    // var port = server.address().port;
    console.log("App now running on port", app.get('port'));
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


app.post('/customer', bodyParser, function (req, res) {
    console.log('customer', JSON.stringify(req.body))
    stripe.customers.create({
        email: req.body.email
    }, function (err, success) {
        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {
            // res.status(201).json(doc.ops[0]);
            res.send({ 'status': true, "success": success });
        }

        // asynchronously called
    });
});