const mongoose = require('mongoose')
const User = require('./User')
const { ObjectId } = require('mongodb')
const UserRaffleSchema = require('./RaffleModels/UserRaffleSchema')

const RaffleSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    users: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserRaffleSchema' }],
    },
    // [1: donation goal, 2: chances set time, 3: enter to buy]
    type: {
        type: Number,
        require: true
    },
    // only for type 3
    productPrice: {
        type: Number
    },
    startTime: {
        type: Number,
        require: true
    },
    // only for type 1
    donationGoal: {
        type: Number
    },
    productType: {
        type: String
    },
    amountLiked: {
        type: Number,
        require: true,
        default: 0
    },
    images: {
        type: [String],
        require: true
    },
    hostedBy: {
        type: ObjectId
    },
    charities: {
        type: [String]
    },
    sizes: {
        type: [String],
        require: true
    },
    approved: {
        type: Boolean,
        require: true,
        default: false
    },
    archived: {
        type: Boolean,
        require: true,
        default: false
    }

})

const Raffle = mongoose.model('Raffles', RaffleSchema)
module.exports = Raffle