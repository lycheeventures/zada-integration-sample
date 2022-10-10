const router = require("express").Router();
var Storage = require('node-storage');
var store = new Storage('cache');
const { showConsole } = require('../helper/utils');
var FormData = require('form-data');
const fetch = require('node-fetch');

// Function to send issue credential
const issueCredential = async (credDef, credentialsObject) => {
    try {

        const connectionId = store.get('USER').connectionId;

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
            headers: { 'Authorization': 'Bearer ' + store.get('TOKEN') }
        })
            .then(res => res.json())
            .then(json => {
                console.log("🚀 ~ file: issueCred.js ~ line 27 ~ issueCredential ~ json", json)

            }).catch((data) => {
                showConsole("issueCredential fetch catch:", data);
            })

    } catch (error) {
        showConsole(`${error.message}`);
    }
}

module.exports = { issueCredential };