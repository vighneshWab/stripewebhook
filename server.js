// server.js
var express = require("express");
// var bodyParser = require("body-parser");
var bodyParser = require('body-parser').json();

var stripe = require('stripe')("sk_test_o582mFkZFmS94mvRLtlhWcFx");
var Promise = require('promise');
var admin = require('firebase-admin');

// var serviceAccount = require("key/serviseAccount.json");

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://advertismentboard-a4a11.firebaseio.com"
// })

console.log(admin.name)

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var cors = require('cors');
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
app.use(cors())
var server = app.listen(app.get('port'), function () {
    // var port = server.address().port;

    console.log("App now running on port", new Date().toLocaleString());
});


// apis end points will be here

app.get('/', function (req, res) {
    console.log('root')
    res.send('connection succesfully');
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
}



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
app.post('/customer_details', bodyParser, function (req, res) {
    console.log('customer', JSON.stringify(req.body.customer))

    stripe.customers.retrieve(req.body.customer, function (err, success) {
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

app.get('/customer_seller/:id', function (req, res) {
    console.log('customer_seller', req.params.id)
    res.send('customer')
})


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
        currency: "aud",
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

app.post('/create_source', bodyParser, function (req, res) {
    console.log('create_source', JSON.stringify(req.body))
    var customer = req.body.customer;
    var source = req.body.source;

    stripe.customers.createSource(
        customer,
        { source: source },
        function (err, success) {
            if (err) {
                res.send({ 'status': false, "err": err });

            }
            if (success) {
                res.send({ 'status': true, "success": success });
            }
        }
    );


});

app.post('/defult_source', bodyParser, function (req, res) {
    console.log('defult_source')
    var customer = req.body.customer;
    var source = req.body.source;

    stripe.customers.update(
        customer,
        {
            default_source: source
        },
        function (err, success) {
            if (err) {
                res.send({ 'status': false, "err": err });

            }
            if (success) {
                res.send({ 'status': true, "success": success });
            }
        }
    );


});


app.post('/defult_source_card', bodyParser, function (req, res) {
    console.log('defult_source')
    var customer = req.body.customer;
    var source = req.body.source;

    stripe.customers.update(
        customer,
        {
            default_card: source
        },
        function (err, success) {
            if (err) {
                res.send({ 'status': false, "err": err });

            }
            if (success) {
                res.send({ 'status': true, "success": success });
            }
        }
    );


});



app.post('/upcoming_invoice', bodyParser, function (req, res) {
    console.log('create_source', JSON.stringify(req.body))
    var customer = req.body.customer;
    var token = req.body.token;

    stripe.invoices.list(
        { limit: 100 },
        function (err, success) {
            if (err) {
                res.send({ 'status': false, "err": err });

            }
            if (success) {
                res.send({ 'status': true, "success": success });
            }
        }
    );


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

app.get('/cancel_subscription/:id', bodyParser, function (req, res) {
    console.log('cancel_subscription', req.params.id);
    var subId = req.params.id;
    stripe.subscriptions.del(subId.toString(), function (err, success) {
        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {

            res.send({ 'status': true, "success": success });
        }
    });
});


app.post('/update_subsciption', bodyParser, function (req, res) {
    console.log('subscription', JSON.stringify(req.body))

    var subscription = stripe.subscriptions.retrieve(req.body.subcription).then(function (response) {
        var item_id = response.items.data[0].id;
        stripe.subscriptions.update(req.body.subcription, {
            items: [{
                id: item_id,
                plan: req.body.plan,
            }],
        }, function (err, success) {

            if (err) {
                res.send({ 'status': false, "err": err });
            }
            if (success) {
                res.send({ 'status': true, "success": success });
            }
        });
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
        var customerId = data.data.object.customer;
        console.log(customerId)
        stripe.customers.retrieve(
            customerId,
            function (err, customer) {
                if (err) {
                    reject({ "error": err });
                }
                if (customer) {
                    var subsciption_id = customer.subscriptions.data[0].id;

                    console.log('subsciption_id', subsciption_id)

                    // resolve({ "response": customer });
                    // var host = "http://localhost:3000/cancel_subsciption/" + subsciption_id;
                    var host = "https://advertismentboard-a4a11.firebaseapp.com/cancel_subsciption/" + subsciption_id;

                    var clickhere = "<a href='" + host + "'> Click Here </a>"
                    var mailOptions = {
                        from: 'abhijeet.k.dandekar@gmail.com',
                        to: customer.email,
                        subject: 'End of Trial Period',
                        html: 'You account will be charged automatically within 3 days. If you like to cancel the subscription please click here ' + clickhere

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

app.delete('/plans/:id', bodyParser, function (req, res) {
    console.log('Plan deleted', req.params.id);
    var subId = req.params.id;
    stripe.plans.del(subId.toString(), function (err, success) {
        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {

            res.send({ 'status': true, "success": success });
        }
    });
});


app.delete('/customer/:id', bodyParser, function (req, res) {
    console.log('Plan customers', req.params.id);
    var subId = req.params.id;
    stripe.customers.del(subId.toString(), function (err, success) {
        if (err) {
            res.send({ 'status': false, "err": err });
        }
        if (success) {

            res.send({ 'status': true, "success": success });
        }
    });
});



