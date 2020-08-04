const mongoose = require('mongoose')
const User = require('./User')
const { ObjectId } = require('mongodb')
// const UserRaffleSchema = require('./RaffleModels/UserRaffleSchema')

const UserRaffleSchema = mongoose.Schema({
    userID: {
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

const WinnerSchema = mongoose.Schema({
    userID: {
        type: ObjectId,
        require: true
    },
    reward: {
        type: Number,
        require: true
    }
})

const RaffleSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // subdocument of userraffleschema : see https://mongoosejs.com/docs/subdocs.html
    users: {
        children: [UserRaffleSchema],
        child: UserRaffleSchema
    },
    // [1: donation goal, 2: enter to buy]
    type: {
        type: Number,
        required: true
    },
    // only for type 2
    productPrice: {
        type: Number
    },
    startTime: {
        type: Number,
        // required: true
    },
    drawingDuration: {
        type: Number,
        // required: true
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
        required: true,
        default: 0
    },
    images: {
        type: [String],
        required: true
    },
    hostedBy: {
        type: ObjectId
    },
    charities: {
        type: [String]
    },
    // for M, W, Y
    sizeTypes: {
        type: [String]
    },
    sizes: {
        type: [String],
        require: true
    },
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    archived: {
        type: Boolean,
        required: true,
        default: false
    },
    valuedAt: {
        type: Number
    },
    winners: {
        children: [WinnerSchema],
        child: WinnerSchema
    },
    // unix timestamp, last time someone donated
    lastDonatedTo: {
        type: Number
    },
    // geocoding
    radius: {
        type: Number
    }

})

const Raffle = mongoose.model('Raffles', RaffleSchema)
module.exports = Raffle