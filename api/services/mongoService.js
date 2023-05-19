const mongoose = require("mongoose");
const Rentals = require("../models/rentals");
const PreviousRides = require("../models/previousRides");
require('dotenv').config({
    path: `${__dirname}/../.env`
});

const conf = {
    dbUrl: process.env.DB_CON_STR,
    connectOptions: {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
};

async function connectMongo() {
    try {
        await mongoose.connect(conf.dbUrl, conf.connectOptions);
        console.log("DB listening at " + conf.dbUrl);
    } catch (err) {
        console.log(err);
    }
}

async function getAllRentals() {
    return new Promise((resolve, reject) => {
        Rentals.find().then(data => resolve(data)).catch(err => reject(err));
    })
}

async function getRentalById(params) {


    try {
        return await Rentals.findById(params);
    } catch (err) {
        console.log(err);
        return null;
    }

}
// async function getRentalByName(params) {

//     try {
//         return await Rentals.findOne({
//             type: params
//         });
//     } catch (err) {
//         console.log(err);
//         return null;
//     }

// }

function addPreviousRide(params) {

    return new Promise((resolve, reject) => {
        PreviousRides(params).save().then();
        resolve();
    });

}

function getAllPreviousRides() {
    return new Promise((resolve, reject) => {
        PreviousRides.find().then(data => resolve(data)).catch(err => reject(err));
    })
}
module.exports = {
    connectMongo,
    getAllRentals,
    getRentalById,
    getAllPreviousRides,
    addPreviousRide
}