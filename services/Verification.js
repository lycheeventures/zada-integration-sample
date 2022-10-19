const axios = require('axios');
const { showConsole } = require('../helper/utils');

const { getMemoryValue, setMemoryValue } = require('../cache.js');

if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

class VerificationServicesClass {

    /**
  * Function to send verification request to already connected
  * ZADA Wallet user.
  * @param {String} connectionId 
  * @param {String} policyId 
  */
    sendVerificationRequest = (connectionId) => {

        return new Promise((resolve, reject) => {
            try {

                showConsole('Sending verification request...');

                axios({
                    url: `${process.env.CORE_API_URL}/api/credential/submit_verification`,
                    method: 'POST',
                    data: {
                        connectionId: connectionId,
                        policyId: process.env.POLICY_ID
                    },
                    headers: {
                        'Authorization': `Bearer ${getMemoryValue('TOKEN')}`
                    }
                }).then(json => {
                    showConsole(`Verification request is sent successfully for connectionId ${connectionId}`);
                    resolve(true);
                }).catch((error) => {
                    showConsole(`Sending verification request is failed due to ${error.message}\n\n`);
                    reject(false);
                })

            } catch (error) {
                showConsole(`Sending verification request is failed due to ${error.message}\n\n`);
                reject(error)
            }
        })
    }

    /**
     * Function to get verification details for user's submitted verification
     * @param {String} verificationId 
     * @returns 
     */
    getVerificationDetails = (verificationId) => {

        return new Promise((resolve, reject) => {
            try {

                showConsole('Sending verification request...');

                axios({
                    url: `${process.env.CORE_API_URL}/api/credential/get_verification_status`,
                    method: 'GET',
                    params: {
                        verificationId: verificationId,
                    },
                    headers: {
                        'Authorization': `Bearer ${getMemoryValue('TOKEN')}`
                    }
                }).then(result => {

                    const policyName = result.data.verification.policy.attributes[0].policyName;
                    resolve(result.data.verification.proof[policyName].attributes);
                
                }).catch((error) => {
                
                    showConsole(`Getting Verification details got error ${error.message}\n\n`);
                    reject(false);
                
                })

            } catch (error) {
                showConsole(`Getting Verification details got error ${error.message}\n\n`);
                reject(error)
            }
        })
    }

}

const VerificationServices = new VerificationServicesClass;

module.exports = VerificationServices;
