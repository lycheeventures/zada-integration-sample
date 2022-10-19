const axios = require('axios');
var FormData = require('form-data');
const fetch = require('node-fetch');

const { showConsole } = require('../helper/utils');
const { getMemoryValue, setMemoryValue } = require('../cache.js');

if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

class IssuanceServicesClass {

    /**
     * Function to send issue credential
     * ZADA Wallet user can easily use metadata to make connection
     * with it.
     * @param {String} credDef 
     * @param {String} credentialsObject 
     */

    issueCredential = (credDef, credentialsObject) => {

        return new Promise((resolve, reject) => {
            try {

                const connectionId = getMemoryValue('USER').connectionId;

                const formData = new FormData();
                formData.append('definitionId', credDef);
                formData.append('connectionId', connectionId);
                formData.append('credentialValues', JSON.stringify(JSON.stringify(credentialsObject)));
                formData.append('sendEmail', 'false');
                formData.append('sendSms', 'false');

                var OFFER_CRED_API_PATH = process.env.CORE_API_URL + '/api/credential/offer_credential'

                return fetch(OFFER_CRED_API_PATH, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': 'Bearer ' + getMemoryValue('TOKEN') }
                })
                    .then(res => res.json())
                    .then(json => {
                        console.log("🚀 ~ file: issuance.js ~ line 27 ~ issueCredential ~ json", json)
                        resolve(true);
                    }).catch((data) => {
                        showConsole("issueCredential fetch catch:", data);
                        reject(false);
                    })

            } catch (error) {
                showConsole(`Creating Connection got error for name ${error.message}\n\n`);
                reject(error)
            }
        })
    }

}

const IssuanceServices = new IssuanceServicesClass;

module.exports = IssuanceServices;
