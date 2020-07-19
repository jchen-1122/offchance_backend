const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AddressSchema = require('../models/UserModels/Address')
const CreditCardSchema = require('../models/UserModels/CreditCardSchema')
const User = require('../models/User')
const e = require('express')
const router = express.Router()

// visible
router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await User.findOne({email})
        if (!user) {
            res.status(400).send({error: 'unable to login'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).send({error: 'unable to login'})
        }
        // const token = generateAuthToken(user)
        // console.log(token)
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

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

router.patch('/edit/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const _id = req.params.id

    try {
        const user = await User.findOne({
            _id
        })
        console.log(user)
        if (!user) {
            return res.status(400).send({message:'user not found'})
        }
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        res.send(user)  
    } catch (e) {
        res.status(404).send(e)
    }   
})

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
        res.status(500).send({message: 'invalid query params'})
    }
    
})

router.post('/sendcode', async (req, res) => {
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
            return res.status(400).send({message: 'User not found'})
        }
        twilioClient.verify
            .services(serviceid) //Put the Verification service SID here
            .verifications.create({to: email, channel: "email"})
            .then(verification => {
                console.log(verification.sid);
            });
        res.send({done:"email sent"})
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
            return res.status(400).send({message: 'User not found'})
        }
        twilioClient.verify
            .services(serviceid) //Put the Verification service SID here
            .verificationChecks.create({ to: email, code: code })
            .then(verification_check => {
                console.log(verification_check.status)
                if (verification_check.status === 'approved') res.send({done: "correct code!"})
                res.send({done: "invalid code"})
            });
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router