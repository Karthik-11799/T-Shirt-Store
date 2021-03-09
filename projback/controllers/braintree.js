var braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: 'g7gpxspmfm9vp4vz',
    publicKey: '9p6jsfb2jmpfc6dw',
    privateKey: 'efd5c59ee7aa7d012a67306fbf9c186f',
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, function (err, response) {
        // var clientToken = response.clientToken;
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true,
            },
        },
        function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(result);
            }
        }
    );
};
