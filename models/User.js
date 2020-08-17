const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcryptjs')
const Raffle = require('./Raffle')
const AddressSchema = require('./UserModels/Address')
const CreditCardSchema = require('./UserModels/CreditCardSchema')

const UserRaffleSchema = mongoose.Schema({
    raffleID: {
        type: ObjectId,
        require: true
    },
    amountDonated: {
        type: Number,
        require: true
    },
    chances: {
        type: Number,
        require: true
    },
    sizeType:{
        type: String
    },
    size:{
        type: String
    },
    timeDonated: {
        type: Number
    }
})

// for when a user wins a raffle
const WonRaffleSchema = mongoose.Schema({
    raffleID: {
        type: ObjectId,
        require: true
    },
    reward: {
        type: Number,
        require: true
    }
})

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
    rafflesEntered: {
        children: [UserRaffleSchema],
        child: UserRaffleSchema
    },
    rafflesWon: {
        children: [WonRaffleSchema],
        child: WonRaffleSchema
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
    },
    reports: {
        type: [String]
    }

})

const User = mongoose.model('Users', UserSchema)
module.exports = User