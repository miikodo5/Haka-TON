const mongoose = require("mongoose");

const PreviousRidesSchema = new mongoose.Schema({
    startDate: {
        type: String,
    },
    time: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    type: {
        type: String
    },
    tariff: {
        type: Number
    },
    tariffUST: {
        type: Number
    }

});

module.exports = mongoose.model('previousRides', PreviousRidesSchema, "previousRides");