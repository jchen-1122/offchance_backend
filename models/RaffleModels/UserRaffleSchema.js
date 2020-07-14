const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')

const UserRaffleSchema = mongoose.Schema({
    id: {
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
    }
})

module.exports = mongoose.model('UserRaffleSchema', UserRaffleSchema)