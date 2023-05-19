const express = require('express');
const cors = require('cors');


const mongoService = require('./services/mongoService')
const TonService = require('./services/tonService')
const convert = require('./convert/convert');
const previousRides = require('./models/previousRides');
const WsPay = require('./services/payment');

const port = process.env.PORT || 8080;

const app = express();

const tonService = new TonService();


app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API is working properly.'
    });
})

app.get('/api/rentals', (req, res) => {
    mongoService.getAllRentals().then(async (data) => {
        const exRate = await convert.convert();
        data.forEach(element => {
            element.tariff = (element.tariff * exRate).toFixed(2);
        });
        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

app.get('/api/previousRides', (req, res) => {
    mongoService.getAllPreviousRides().then((data) => {

        res.json(data);
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
})

// пусть будет
// app.get('/api/exchangeRate', (req, res) => {
//     convert.convert().then((data) => {
//         res.json(data);
//     }).catch(err => {
//         console.log(err);
//         res.status.json(err);
//     })
// })

app.get('/api/rentals/:id', async (req, res) => {
    const exRate = await convert.convert();
    mongoService.getRentalById(req.params.id).then(async (data) => {
        data.tariff = (data.tariff * exRate).toFixed(2);
        res.json(data);
    })
})

// app.post('/api/start', async (req, res) => {

//     if (!req.body.id) {
//         res.status(400).json({message: 'No id!'})
//     } else if (tonService.channelActive) {
//         res.status(400).json({message: 'Payment Channel Active!'})
//     } else {

//         const currRental = await mongoService.getRentalById(req.body.id);
//         const exRate = await convert.convert();
//         const ticksPerMin = 12; // once every 5 sec
//         const amountPerTick = (currRental.tariff * exRate / ticksPerMin).toFixed(9);
//         // console.log(amountPerTick)

//         WsPay(tonService, amountPerTick, ticksPerMin, 'start').then(r => {
//             res.status(200).json({message: 'Channel Created.'})
//         }).catch(err => {
//             res.status(500).json({message: err.toString()})
//         });

//     }

// })

// app.post('/api/stop', async (req, res) => { //req.body.idif (tonService.channelActive) {
//     if (!tonService.channelActive) {
//         res.status(400).json({message: 'Payment Channel Active!'})
//     } else {

//         WsPay(tonService, null, null, 'stop').then(async r => {

//             const currRental = await mongoService.getRentalById(req.body.id);
//             const exRate = await convert.convert();
//             var amount = (currRental.tariff * exRate).toFixed(2);

//             var data = new previousRides(null, null, null, null, null);
//             // 
//             let today = new Date();
//             let dd = String(today.getDate()).padStart(2, '0');
//             let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//             let yyyy = today.getFullYear();

//             today = mm + '/' + dd + '/' + yyyy;
//             //
//             var tot = Number(amount);
//             tot *= (req.body.time / 60);
//             data.startDate = today;
//             data.time = req.body.time;
//             data.totalAmount = tot.toFixed(2);

//             data.type = currRental.type;
//             data.tariff = currRental.tariff;
//             await mongoService.addPreviousRide(data);

//             res.status(200).json({message: 'Channel Closed.'})

//         }).catch(err => {
//             res.status(500).json({message: err.toString()})
//         });

//     }
// })

// app.get('/api/active', (req, res) => {
//     res.json({active: tonService.channelActive})
// })

// mongoService.connectMongo()
//     .then(() => {
//         tonService.initWallets()
//             .then(() => {
//                 app.listen(port, () => {
//                     console.log('App listening on port:', port)
//                 })
//             })
//             .catch(err => console.log('Error initializing wallets!'))
//     })
//     .catch(err => {
//         console.log(err)
//     })

mongoService.connectMongo()
    .then(() => {
        app.listen(port, () => {
            console.log('App listening on port:', port)
        })
    }).catch(err => {
        console.log(err)
    })