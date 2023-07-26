const axios = require('axios');

async function getCoordsForAddress(address){
    return {
        lat: 21.8380,
        lng: 73.7191
    };

    // const response = await axios.get()
}

module.exports = getCoordsForAddress;