const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const AddressSchema = require('../models/UserModels/Address')
const CreditCardSchema = require('../models/UserModels/CreditCardSchema')
const User = require('../models/User')
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

router.post('/signup', (req, res) => {
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
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        instaHandle: req.body.instaHandle,
        phoneNumber: req.body.phoneNumber
    })
    user.save()
    .then(data => {
        console.log(data)
        res.json(data)
    }).catch(e => {
        res.json({message: 'error'})
    })
})

router.patch('/edit', async (req, res) => {
    const updates = Object.keys(req.body)
    // const allowedUpdates = ['name', 'email', 'password']
    // const isValidOperation = updates.every((update) => {
    //     return allowedUpdates.includes(update)
    // })

    // if (!isValidOperation) {
    //     return res.status(404).send({error: 'Invalid Updates!'})
    // }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        
        res.send(req.user)
    } catch (e) {
        res.status(404).send(e)
    }   
})

// not visible
router.get('/:id', async (req, res) => {
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

module.exports = router