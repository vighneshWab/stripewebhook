// server.js
var express = require("express");
// var bodyParser = require("body-parser");
var bodyParser = require('body-parser').json();

var stripe = require('stripe')("sk_test_o582mFkZFmS94mvRLtlhWcFx");
var Promise = require('promise');

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var cors=require('cors');
// stripe.setTimeout(20000);

var app = express();
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: 'abhijeet.k.dandekar@gmail.com',
        pass: 'Ride@123*'
    }
}));

app.set('port', (process.env.PORT || 8080));
app.use(cors);
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

app.post('/stripe-webhook', bodyParser, function (request, response) {

    switch (request.body.type) {
        case 'customer.deleted':
            response.send('OK');
            break;
        case 'customer.subscription.trial_will_end':
            sendmail_trial_ends(request.body).then(function (resolve) {
                response.send(resolve)
            }, function (reject) {
                response.send(reject)

            })
            break;
        default:

            break;



    }

});

let sendmail_trial_ends = function (data) {
    return new Promise(function (resolve, reject) {
        var customerId = data.customer;
        stripe.customers.retrieve(
            customerId,
            function (err, customer) {
                if (err) {
                    reject({ "error": err });
                }
                if (customer) {
                    var mailOptions = {
                        from: 'abhijeet.k.dandekar@gmail.com',
                        to: customer.email,
                        subject: 'End of Trial Period',
                        html: 'You account will be charged automatically within 3 days. If you like to cancel the subscription please click here.'

                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            reject({ "error sendMail ": error });
                        } else {
                            resolve({ "response": info });
                        }
                    });

                }
            }
        );
    })

}




