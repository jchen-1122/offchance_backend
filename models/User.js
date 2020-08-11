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
        type: String,
    },
    last4: {
        type: String
    },
    walletChances: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        type: String
    },

    // male, female, or youth
    sizeType: {
        type: String
    },
    shoeSize: { 
        type: Number
    },
    shirtSize: {
        type: String
    }, 

    likedRaffles: {
        type: [ObjectId]
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

    // Qs for requesting a business account
    host_item: {
        type: String
    },
    host_charity: {
        type: String
    },
    host_details: {
        type: String
    },
    host_birthday: {
        type: Number
    },
    host_raffleType: {
        type: Number
    },


    rafflesPosted: {
        type: [ObjectId]
    },

    informed: {
        type: Boolean,
        default: false
    },
    referralCode: {
        type: String,
        unique: true
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