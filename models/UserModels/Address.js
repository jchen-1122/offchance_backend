const mongoose = require('mongoose')

const AddressSchema = mongoose.Schema({
    streetAddress: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    aptNo: {
        type: String
    },
    state: {
        type: String,
        require: true
    },
    zipcode: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('AddressSchema', AddressSchema)