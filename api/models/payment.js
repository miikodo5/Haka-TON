const mongoService = require('../services/mongoService')
const convert = require('../convert/convert')

var timer = (function () {

    var timerRef = null;
    var startTimer = function () {
        timerRef = setInterval(function () {
            console.log("work!");

            if (true) { //true => pay(amount)

            } else {


                // stopChannel();

            }


        }, 5000);
    };

    var stopTimer = function () {
        clearInterval(timerRef);
        // stopChannel();
    };

    return {
        startTimer: startTimer,
        stopTimer: stopTimer
    };

})();

async function WsPay(amount, status) {
    //startChannel
    switch (status) {
        case 'start':
            setTimeout(function () {
                timer.startTimer();
            }, 5000);
            break;
        case 'stop':
            timer.stopTimer();

            break;

        default:
            break;
    }

    return timer;
}




module.exports = WsPay;