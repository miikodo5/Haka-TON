const mongoService = require('./mongoService')
const convert = require('../convert/convert')

var timer = (function () {

    var timerRef = null;

    var stop = false;

    var startTimer = function (service, amount, tick) {
        stop = false

        timerRef = setInterval(function () {

            if (stop) {
                clearInterval(timerRef);
            } else {
                service.pay(amount)
            }

        }, tick);
    };

    var stopTimer = function () {
        stop = true
    };

    return {
        startTimer: startTimer,
        stopTimer: stopTimer
    };

})();


async function WsPay(service, amount, ticksPerMin, status) {
    if (status == 'start') {
        await service.startChannel().then(() => {
            timer.startTimer(service, amount, 60 * 1000 / ticksPerMin);
        });
        return true
    } else if (status == 'stop') {
        timer.stopTimer();
        await service.closeChannel()
    } else return false;

    return timer;
}




module.exports = WsPay;