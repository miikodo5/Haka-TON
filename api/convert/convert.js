const axios = require('axios');

let response = null;

async function convert() {
    try {
        response = await axios.get('https://pro-api.coinmarketcap.com/v1/tools/price-conversion?CMC_PRO_API_KEY=2d8c2c54-6efe-4eb0-9400-5d9ce6fc1416&amount=1&id=11419');
    } catch (ex) {
        response = null;
        // error
        console.log(ex);
        reject(ex);
    }
    if (response) { //6731
        // success
        const json = response.data;
        // console.log(json.data.quote);
        return json.data.quote.USD.price;
    }
}

module.exports = {
    convert
}