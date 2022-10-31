const axios = require('axios');
const { showConsole } = require('../helper/utils');

const { getMemoryValue, setMemoryValue } = require('../cache.js');

if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

class AuthServicesClass {

    /**
     * Function to authenticate ZADA tenant
     */
    authenticateTenant = () => {

        return new Promise((resolve, reject) => {
            try {

                axios({
                    url: `${process.env.CORE_API_URL}/api/authenticate`,
                    method: 'POST',
                    data: {
                        tenantId: process.env.TENANT_ID,
                        secretPhrase: process.env.TENANT_SECRET,
                    }
                }).then((response) => {
                    showConsole(`${process.env.TENANT_ID} Tenant is successfully authenticated\n\n`);
                    setMemoryValue('TOKEN', response.data.token)
                    resolve(response.data.token);
                }).catch((error) => {
                    showConsole(`Authentication got error ${error.message}\n\n`);
                    resolve(false)
                });

            } catch (error) {
                showConsole(`Authentication got error ${error.message}\n\n`);
                reject(error)
            }
        })
    }

    /**
     * Function to get connection details for connected user's connectionId
     * @param {String} connectionId 
     * @returns 
     */
    getConnectedUserDetails = (connectionId) => {

        return new Promise((resolve, reject) => {
            try {

                axios({
                    url: `${process.env.CORE_API_URL}/api/connection/get_connection`,
                    method: 'GET',
                    params: {
                        connectionId: connectionId,
                    },
                    headers: {
                        'Authorization': `Bearer ${getMemoryValue('TOKEN')}`
                    }
                }).then((response) => {

                    // Decoding name property from connection details
                    const encodedName = response.data.connection.name;
                    var bufferedString = Buffer.from(encodedName, 'base64');
                    const decodedString = bufferedString.toString('utf8');
                    let decodedParts = decodedString.split(':');

                    let userData = {
                        phone: decodedParts[1],
                        name: decodedParts[2],
                        userId: decodedParts[3],
                        connectionId
                    }

                    setMemoryValue('USER', userData);
                    resolve(userData);

                }).catch((error) => {
                    showConsole(`Get Connection got error ${error.message}\n\n`);
                    resolve(false)
                });

            } catch (error) {
                showConsole(`Get Connection got error ${error.message}\n\n`);
                reject(error)
            }
        })
    }

}

const AuthServices = new AuthServicesClass;

module.exports = AuthServices;
