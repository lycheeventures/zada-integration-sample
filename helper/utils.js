const moment = require('moment');

/**
 * Function to show console logs in specified format
 * @param {String} message 
 */
const showConsole = (message) => {
    console.log(`Time: ${moment().format('DD/MM/YYYY')} ~ ${message}`);
}

module.exports = {
    showConsole
};