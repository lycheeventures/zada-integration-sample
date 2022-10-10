const moment = require('moment');

const showConsole = (message) => {
    console.log(`Time: ${moment().format('DD/MM/YYYY')} ~ ${message}`);
}

module.exports = {
    showConsole
};