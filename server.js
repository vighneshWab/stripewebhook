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
    // res.send({ 'test': 'comepeplted', 'param': req.body });
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


app.post('/customer_seller', bodyParser, function (req, res) {
    console.log('customer_seller', JSON.stringify(req.body))
    stripe.customers.create({
        email: req.body.email,
        description: "seller created",
        source: req.body.source
    }, function (err, success) {
        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {
            res.send({ 'status': true, "success": success });
        }

        // asynchronously called
    });
});

app.post('/plans', bodyParser, function (req, res) {
    console.log('plans', JSON.stringify(req.body))
    stripe.plans.create({
        name: req.body.data.UserRole,
        id: req.body.id,
        interval: "month",
        currency: "usd",
        amount: req.body.data.price,
    }, function (err, success) {
        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {
            res.send({ 'status': true, "success": success });
        }
    });
});

app.post('/sources', bodyParser, function (req, res) {
    console.log('change', JSON.stringify(req.body))
    stripe.sources.create({
        type: 'card',
        amount: 0,
        currency: 'aud',
        owner: {
            email: req.body.email,
            name: req.body.userName
        }
    }, function (err, source) {
        if (err) {
            res.send(err);
            res.send({ "err": err })

        }
        if (source) {
            res.send(source);
            res.send({ "source": source })
        }

        // asynchronously called
    });
});


app.post('/subscription', bodyParser, function (req, res) {
    console.log('subscription', JSON.stringify(req.body))
    stripe.subscriptions.create({
        customer: req.body.customer,
        items: [
            {
                plan: req.body.plan,
            },
        ],
    }, function (err, success) {

        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {
            res.send({ 'status': true, "success": success });
        }
    });
});

app.post('/trial_subscription', bodyParser, function (req, res) {
    console.log('trial_subscription', JSON.stringify(req.body))

    stripe.subscriptions.create({
        customer: req.body.customer,
        trial_period_days: 30,
        items: [
            {
                plan: req.body.plan,
            },

        ],
    }, function (err, success) {

        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {
            res.send({ 'status': true, "success": success });
        }
    });
});


// invoice_payment_successed

app.post('/invoice_payment_successed', bodyParser, function (req, res) {
    const endpointSecret = "whsec_TLjtDyPMwnyiZM6CObp4cPly7bSjTuSg";

    let sig = req.headers["stripe-signature"];
    let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    console.log('invoice_payment_successed', JSON.stringify(req.body))
    res.json({ received: true });

});


app.post('/stripe-webhook', bodyParser,function (request, response) {
    if (request.body.type === 'customer.deleted') {
        console.log(request.body.data.object);
    }
    response.send('OK');
});
