const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')
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
        required: true,
        unique: true
    },
    // email and password types 
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    instaHandle: {
        type: String
    },

    // location
    city: {
        type: String
    },
    state: {
        type: String
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
        default: false,
        required: true
    },
    // 3 Qs for requesting a business account
    host_item: {
        type: String
    },
    host_charity: {
        type: String
    },
    host_details: {
        type: String
    },
    rafflesPosted: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Raffle' }]
    },

    informed: {
        type: Boolean,
        default: false
    },
    referrals: {
        type: Number
    },
    // would be its own schema later
    analytics: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: true
    }

})


const User = mongoose.model('Users', UserSchema)
module.exports = User