const express = require('express')
const bcrypt = require('bcryptjs')
const shortid = require('shortid');
const jwt = require('jsonwebtoken')
const AddressSchema = require('../models/UserModels/Address')
const CreditCardSchema = require('../models/UserModels/CreditCardSchema')
const User = require('../models/User')
const e = require('express')
const router = express.Router()
const paypal = require('paypal-rest-sdk')
const { Expo } = require("expo-server-sdk");
const expo = new Expo();
const cors = require("cors");

// payment stuff
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'ARsr229eKQClg9GUI4gMhbbbm78i2d-q6ilI68m5u-9LVeenC6XTTUu_BJntIDhbrwQv1fF16lYDmJkA',
    'client_secret': 'EMrjTPKoJ3Ogc1gLxjJogNpMjmJI3-mFsT2K_EBsiKpcE1bH4PwYBsa2hC-x1KpHXa_YQHzh2gTHfvOr'
})

const stripe = require('stripe')('sk_test_51HCrjPEO217KAnwYGYqsCiWAzunKM38eHKbUdoJmnT8qLbQQVCJZn8PdYMZSbZHKXYxc4EVlyqMID5lbz0PpdX1k00tL3Ylis9');

// ibm done
router.post('/oneTimeNoSave', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: req.body.name,
                },
                unit_amount: req.body.amount * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://www.blank.org',
        cancel_url: 'https://lmaothiswontwork'
    });
    res.json({ session_id: session.id });
});

// ibm done
router.post('/oneTimeSave', async (req, res) => {
    const customer = await stripe.customers.create();
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: req.body.name,
                },
                unit_amount: req.body.amount * 100,
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://www.blank.org',
        cancel_url: 'https://lmaothiswontwork',
        customer: customer.id
    });
    res.json({ session_id: session.id, customer: customer.id });
});

// ibm done
router.post('/getLast4', async (req, res) => {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: req.body.customer,
        type: 'card',
    });
    res.send(paymentMethods.data[0].card.last4)
})


// ibm done
router.post('/autopay', async (req, res) => {
    // const paymentMethods = await stripe.paymentMethods.list({
    //     customer: 'cus_HoI8DwIfP2dolr',
    //     type: 'card',
    // });
    const paymentMethods = await stripe.paymentMethods.list({
        customer: req.body.customer,
        type: 'card',
    });
    const intent = await stripe.paymentIntents.create({
        amount: req.body.amount * 100,
        currency: 'usd',
        customer: req.body.customer,
    });
    res.json({ payment_intent: intent, payment_id: paymentMethods.data[0].id })
})


router.get('/paypal', (req, res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            // in the future this will be an ibm cloud function 
            "return_url": 'http://192.168.0.22:3000/user/success',
            "cancel_url": 'http://lmaothiswontwork'
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };


    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href)
        }
    });
})

router.get('/success', (req, res) => {
    // res.send("Success");
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: "1.00"
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (
        error,
        payment
    ) {
        if (error) {
            res.send("error")
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send("success");
        }
    });
});

router.get('/cancel', (req, res) => {
    res.send("cancel");
});

// moved to ibm
// visible
router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (password == null) {
        res.status(400).send({ error: 'unable to login' })
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(400).send({ error: 'unable to login' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send({ error: 'unable to login' })
        }
        // const token = generateAuthToken(user)
        // console.log(token)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// moved to ibm
router.post('/signup', async (req, res) => {
    // const address = new AddressSchema({
    //     streetAddress: req.body.streetAddress,
    //     city: req.body.city,
    //     aptNo: req.body.aptNo,
    //     state: req.body.state,
    //     zipcode: req.body.zipcode
    // })
    // const ccInfo = new CreditCardSchema({
    //     ccname: req.body.ccname,
    //     cardNumber: req.body.cardNumber,
    //     cvv: req.body.cvv,
    //     expirationMonth: req.body.expirationMonth,
    //     expirationYear: req.body.expirationYear,
    //     billingAddress: req.body.billingAddress
    // })
    const obj = {}
    Object.keys(req.body).forEach(el => {
        obj[el] = req.body[el]
    })
    obj['password'] = await bcrypt.hash(obj['password'], 8)
    obj['referralCode'] = shortid.generate().toUpperCase()
    const user = new User(obj)

    user.save()
        .then(data => {
            console.log(data)
            res.json(data)
        }).catch(e => {
            res.json(e)
        })
})

// not visible
// ibm done
router.get('/id/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findOne({
            _id
        })
        if (!user) {
            return res.status(400).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

// dont think this is in use
router.patch('/ids/', async (req, res) => {
    const ids = req.body.ids
    console.log(ids)
    try {
        const results = await User.find({
            _id: {
                $in: ids
            }
        })
        console.log(results)

        /*const user = await User.findOne({
            _id
        })
        if (!user) {
            return res.status(400).send()
        }*/
        res.send(results)
    } catch (e) {
        res.status(500).send()
    }
})

// ibm done
router.patch('/edit/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const _id = req.params.id

    try {
        const user = await User.findOne({
            _id
        })
        console.log(user)
        if (!user) {
            return res.status(400).send({ message: 'user not found' })
        }
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        console.log('here')
        if (req.body.password) {
            user['password'] = await bcrypt.hash(user['password'], 8)
        }
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(404).send(e)
    }
})

// ibm done
router.get('/query/', async (req, res) => {
    try {
        const query = req.query.query
        const dir = req.query.dir
        const val = req.query.val
        const limit = req.query.limit

        const obj = {}

        if (val) {
            obj[query] = val
            const users = await User.find(obj).limit((limit != null) ? parseInt(limit) : 0)
            res.status(200).send(users)
        } else if (dir) {
            obj[query] = (dir === 'asc') ? 1 : -1
            const users = await User.find({}).sort(obj).limit((limit != null) ? parseInt(limit) : 0)
            res.status(200).send(users)
        } else {
            const users = await User.find({}).limit((limit != null) ? parseInt(limit) : 0)
            res.status(200).send(users)
        }
    } catch (e) {
        res.status(500).send({ message: 'invalid query params' })
    }

})

// 
router.post('/sendcode', async (req, res) => {
    console.log('here')
    const email = req.body.email

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceid = process.env.TWILIO_VERIFY_SERVICE

    const twilioClient = require("twilio")(accountSid, authToken)

    try {
        const user = await User.findOne({
            "email": email
        })
        if (!user) {
            return res.status(400).send({ error: 'User does not exist' })
        }
        twilioClient.verify
            .services(serviceid) //Put the Verification service SID here
            .verifications.create({ to: email, channel: "email" })
            .then(verification => {
                console.log(verification);
            });
        res.send({ done: "email sent" })
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/verifycode', async (req, res) => {
    const email = req.body.email
    const code = req.body.code

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceid = process.env.TWILIO_VERIFY_SERVICE

    const twilioClient = require("twilio")(accountSid, authToken)

    try {
        const user = await User.findOne({
            "email": email
        })
        if (!user) {
            return res.status(400).send({ error: 'User does not exist' })
        }
        twilioClient.verify
            .services(serviceid) //Put the Verification service SID here
            .verificationChecks.create({ to: email, code: code })
            .then(verification_check => {
                console.log(verification_check.status)
                if (verification_check.status === 'approved') res.send({ done: "correct code", _id: user._id })
                res.send({ error: "Invalid code" })
            });
    } catch (e) {
        res.status(500).send()
    }
})

// 
router.post('/sendphone', async (req, res) => {
    const phone = '+1' + req.body.phoneNumber

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceid = process.env.TWILIO_VERIFY_SERVICE

    const twilioClient = require("twilio")(accountSid, authToken)

    try {
        twilioClient.verify.services(serviceid)
            .verifications
            .create({ to: phone, channel: 'sms' })
            .then(verification => console.log(verification.status));
        res.send({ done: "email sent" })
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/verifyphone', async (req, res) => {
    const phone = '+1' + req.body.phoneNumber
    const code = req.body.code

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceid = process.env.TWILIO_VERIFY_SERVICE

    const twilioClient = require("twilio")(accountSid, authToken)

    try {
        twilioClient.verify.services(serviceid)
            .verificationChecks
            .create({ to: phone, code: code })
            .then(verification_check => {
                console.log(verification_check)
                if (verification_check.status === 'approved') res.send({ done: "correct code" })
                res.send({ error: "Invalid code" })
            });
    } catch (e) {
        res.status(500).send()
    }
})

// ===============================================

const handlePushTokens = (data) => {
    let notifications = [];
    for (let pushToken of data.pushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        // https://docs.expo.io/push-notifications/sending-notifications/#message-request-format
        notifications.push({
            to: pushToken, // send this message to the user using the pushtoken
            sound: "default",
            title: data.title,
            body: data.message,
            data: { data }
        });
    }
    console.log('NOTIFS', notifications)
    let chunks = expo.chunkPushNotifications(notifications);

    (async () => {
        for (let chunk of chunks) {
            try {
                let receipts = await expo.sendPushNotificationsAsync(chunk);
                console.log('RECEIPTS', receipts);
            } catch (error) {
                console.error(error);
            }
        }
    })();
};

router.post("/message", async (req, res) => {
    try {
        handlePushTokens(req.body);
        console.log(`Received message, with title: ${req.body.title}`);
        res.send(`Received message, with title: ${req.body.title}`);
    }
    catch (e) {
        res.status(500).send()
    }
});

module.exports = router