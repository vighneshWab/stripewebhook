// server.js
var express = require("express");
var bodyParser = require('body-parser').json();
var stripe = require('stripe')("sk_test_o582mFkZFmS94mvRLtlhWcFx");
var Promise = require('promise');
var admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert({
        "projectId": "advertismentboard-a4a11",
        "clientEmail": "firebase-adminsdk-tmypg@advertismentboard-a4a11.iam.gserviceaccount.com",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmcn3flj8RxsVD\nGCsQLszdh+OUH/k3SmH+o0MiP1tb0a5gLkR2DGRFGypWfzxp+O8kioUv6uFTeqip\nh+7ip2Bp1pcap4ESD5oZ6RngTlzuydaUJ7sX0lM1585PvJ756h+hWo8I/qKDKybX\n37TtmNJhFjA1AT8yEYXTbAnnJOSCLKmi8cbo0rTs45fJ5Bn54+SML4i0uOSYz/Ga\nXV15oZ/xEALx3ZvVgPnlRAvNiUqL++1pHctt18lWG3k7PBz3D5Pop03AuCnLuc0T\nZ809SmgAlP/oQGJYleQXKyj7coHQSxLhQxzzlhEMlAwHiOygrrBA4HnwDBG/7HI3\n2e/QW6MTAgMBAAECggEAM3xW00J2X9lMS2S+bVMMq7nM+5SoUiIADfQSYBWY/N3v\nQnENXDaZDYdJoVfaKC2IS5VNfXT6HghjA424pwN/Hz3xn50Qn7WTxVAFYQzcUkC8\nzzc6+DNm6dW6S4/c3RE+l3qbo/yf6FMAwOXB4XzUFpP2dW7dTW9+JdfVeFpBFMKc\nQQTk9kQhJdeLn2bXe3XuG/7P1740gaxIvIJD4mMwN9dXDRGUoX2UakrEzVITnLUT\n6BcHQ0Zz1UgDcvWDoSojAnqcRklihJI6UcDUKskjgrFLJ3GmR21pJymAy+NTHxpX\nTBG0OLPfua+Zme8UrlnCILx302KyBitd1KHWw8cVgQKBgQDQM9bxn68TuGGPnDJs\nTRcTmyQUeJl4dxcL3UpAr3EMuMMFpgMB3+xXOPWSLFF8Q95xslvU4OjulF1M5LO7\neR6MvCvALHZrlDMiiGYpPSUJwJlK2vrkvuP2EsmMqVPDfvgpQEFtCG+ZSG+zXAn4\nZ1K5/EZTqg2OJv+nfkQVIwhujwKBgQDMqKzXXgmsZOQCOzNPFeZbHvMO7InzghdT\nizsdIploPt99vuojUOFXNU7kAlF0YkWvEiYwaMtn19GpeMS2EUQEyrgvNZ/9fCnw\nM2CHxMbUTQ5SvoLxdrGEsLK8LUto0ai0NMuIlsrU8WkAqCdH5/OycrAQp9tJ5ovB\nofMO8AeFPQKBgFkFsWRC+OMftWdoTA8Or01MypKONmDR2uLRzcv2uAnOfmTN5P9K\nNY3d5vKHTJgrlNNchfNx72cDvRkBuO/yC+P1GWfkGwZIqcycMcJ0SH/xABqHoztn\ne6VdxxwD0rMGeSl6Nf9e2gjadhhkxEaYN0Ea4x8m2QDtH+cIEChRgGt1AoGBAMZ2\nl83t+lF8MQPc5t+9a/pXI/sH9Kr4L6irbvLM95j4x3/IYINIzozkPBGuEdFb7xlb\n7z6okP+tcTr3y0KHsb832q6lQPXurzioieZ/MxTzeH1TE+YWZQU42MrU3bjS/9dp\nDyrwl9cyF9I0PotjapZU01oDfQrIECUA6JRGvfQ9AoGBAJ44Hy0gyD4PLTviyY6p\n2o/d2uZCwEn3FQfdOxBiZEqayrfUUp4MfHdiRAb87uID/i5HTim5gChboGY3R/FM\n4OYWaJpPDHqTronMZWwaVP0oi0N3NsNcYbQoFuVQR/BZCdRmHl7ttlfV4FoWTbbJ\nzJlHPMdKcyof6S4JzJJQr7Vb\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://advertismentboard-a4a11.firebaseio.com"
})

var db = admin.database();


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



app.post('/changes', bodyParser, function (req, res) {
    stripe.charges.create({
        amount: req.body.amount,
        currency: "aud",
        description: req.body.description,
        source: req.body.source,
        // customer: req.body.customer
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
    console.log('upcoming_invoice', JSON.stringify(req.body))
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




app.get('/subscription/:id', bodyParser, function (req, res) {
    console.log('retirve subscription', req.params.id);
    var subId = req.params.id;
    stripe.subscriptions.retrieve(subId.toString(), function (err, success) {

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

        case 'invoice.payment_failed':
            var customerID = request.body.data.object.customer;
            console.log(customerID);
            var customer_products = 'hahaha';
            var customer_companys = 'ha company'
            var disbleProducts = {};
            var disbleCompanys = {};
            var uid_disable_true;
            var user = db.ref('user').orderByChild('customerID').equalTo(customerID)
            user.once('child_added', function (snap) {
                var res = snap.val();
                console.log('uid', res.uid);
                uid_disable_true = res.uid + "_" + true;
                var refProducts = db.ref('sellerproduct').orderByChild('uid_disable').equalTo(uid_disable_true)
                refProducts.on('value', function (products) {
                    customer_products = products.exportVal();
                    console.log('373 :: customer_products', customer_products)

                    if (customer_products != null || customer_products != undefined) {
                        Object.keys(customer_products).forEach(function (k) {
                            var disable = k + '/disable';
                            disbleProducts[disable] = false;
                            var uid_disable = k + '/uid_disable';
                            disbleProducts[uid_disable] = res.uid + "_" + false;
                        });
                        var sellerProduct = db.ref('sellerproduct');
                        sellerProduct.update(disbleProducts, function (snap) {
                            if (snap) {
                                console.log('disbleProducts', snap)
                            } else {
                            }

                        })

                    }

                }, function (error) {
                    console.log('errored')
                })
                // refProducts.off();
                var refCompanys = db.ref('sellercompany').orderByChild('uid_disable').equalTo(uid_disable_true)
                refCompanys.on('value', function (companys) {
                    customer_companys = companys.exportVal();
                    console.log('398 :customer_companys ::', customer_companys)
                    if (customer_companys != null || customer_companys != undefined) {
                        Object.keys(customer_companys).forEach(function (k) {
                            var disable = k + '/disable';
                            disbleCompanys[disable] = false;
                            var uid_disable = k + '/uid_disable';
                            disbleCompanys[uid_disable] = res.uid + "_" + false;
                        });
                        var sellerCompany = db.ref('sellercompany');
                        sellerCompany.update(disbleCompanys, function (snap) {
                            if (snap) {
                                console.log('disbleCompanys', snap)
                            } else {
                            }

                        })
                    }


                }, function (error) {
                    console.log('errored')
                })

                var resolve = {
                    customer_products: customer_products,
                    disbleProducts: disbleProducts,
                    customer_companys: customer_companys,
                    disbleCompanys: disbleCompanys,
                    product_update: true,
                    compnay_update: true

                }

                response.send(resolve)
                // refCompanys.off();
            }, function (error) {
                console.log('errored')
            });
            // user.off();


            break
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



