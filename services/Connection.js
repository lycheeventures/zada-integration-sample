const axios = require('axios');
const { showConsole } = require('../helper/utils');
const { getMemoryValue, setMemoryValue } = require('../cache.js');

if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

class ConnectionServicesClass {

    /**
     * Function to create metadata for given connectionName.
     * ZADA Wallet user can easily use metadata to make connection
     * with it.
     * @param {String} connectionName 
     */

    createConnection = (connectionName) => {

        return new Promise((resolve, reject) => {
            try {

                showConsole(`Creating Connection...`);

                axios({
                    url: `${process.env.CORE_API_URL}/api/connection/create_connection`,
                    method: 'POST',
                    data: {
                        name: connectionName,
                    },
                    headers: {
                        'Authorization': `Bearer ${getMemoryValue('TOKEN')}`
                    }
                }).then((response) => {
                    setMemoryValue('USER', response.data.connection);
                    showConsole(`Connection is created successfully against name ${connectionName}\nJSON OUTPUT\n${JSON.stringify(response.data.connection, null, 4)}\n\nOpen this URL in browser and scan with ZADA Wallet App to make Connection: ${response.data.connection.zadaURL}\n\n`);
                    resolve(response.data.connection);
                }).catch((error) => {
                    showConsole(`Creating Connection got error for name ${error.message}\n\n`);
                    resolve(false)
                });

            } catch (error) {
                showConsole(`Creating Connection got error for name ${error.message}\n\n`);
                reject(error)
            }
        })
    }

}

const ConnectionServices = new ConnectionServicesClass;

module.exports = ConnectionServices;
