const mongoose = require('mongoose')
const AddressSchema = require('./Address')

const CreditCardSchema = mongoose.Schema({
    ccname: {
        type: String,
        require: true
    },
    cardNumber: {
        type: Number,
        require: true
    },
    cvv: {
        type: Number,
        require: true
    },
    expirationMonth: {
        type: Number,
        require: true
    },
    expirationYear: {
        type: Number,
        require: true
    },
    billingAddress: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AddressSchema' }],
        require: true
    }
})


module.exports = mongoose.model('CreditCardSchema', CreditCardSchema)