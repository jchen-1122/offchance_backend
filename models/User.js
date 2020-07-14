const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const Raffle = require('./Raffle')
const AddressSchema = require('./UserModels/Address')
const CreditCardSchema = require('./UserModels/CreditCardSchema')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    // email and password types
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    // phone number type
    phoneNumber: {
        type: String,
        required: true
    },
    // type?
    profilePicture: {
        type: String
    },
    paymentInfo: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CreditCardSchema' }],
    },
    walletChances: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        type: { type: mongoose.Schema.Types.ObjectId, ref: 'AddressSchema' }
    },
    shoeSize: {
        type: Number
    },
    shirtSize: {
        type: Number
    }, 
    likedRaffles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Raffle' }]
    },
    enteredRaffles: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Raffle' }]
    },
    following: {
        type: [ObjectId]
    },
    followers: {
        type: [ObjectId]
    },
    isHost: {
        type: Boolean,
        default: false
    },
    rafflesPosted: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Raffle' }]
    },
    referrals: {
        type: Number
    },
    // would be its own schema later
    analytics: {
        type: String
    }
})

module.exports = mongoose.model('Users', UserSchema)