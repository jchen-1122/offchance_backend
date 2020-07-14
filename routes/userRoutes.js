const express = require('express')
const AddressSchema = require('../models/UserModels/Address')
const CreditCardSchema = require('../models/UserModels/CreditCardSchema')
const User = require('../models/User')
const router = express.Router()

router.get('/:id', async (req, res) => {
    const _id = req.params.id
    console.log('finding')
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

router.post('/', (req, res) => {
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
        phoneNumber: req.body.phoneNumber,
        profilePicture: req.body.profilePicture,
        walletChances: req.body.walletChances
    })

    user.save()
    .then(data => {
        console.log(data)
        res.json(data)
    }).catch(e => {
        res.json({message: 'error'})
    })
})

module.exports = router