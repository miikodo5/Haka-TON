const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
    type: {
        type: String
    },
    tariff: {
        type: Number
    },
    battery: {
        type: Number
    },
    inUse: {
        type: Boolean
    },
    location: {
        lat: Number,
        lng: Number
    }

});

module.exports = mongoose.model('rentals', RentalSchema, "rentals");