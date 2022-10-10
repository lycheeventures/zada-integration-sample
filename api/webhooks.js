const router = require("express").Router();
var Storage = require('node-storage');
var store = new Storage('cache');
const { showConsole } = require('../helper/utils');
const axios = require('axios').default;
const { askAction, askCredDef, askIdentifier, getIdentifierValue } = require('../helper/cli_inputs');
const { issueCredential } = require('./issueCred');

/*
    This webhook will be triggered when ZADA Wallet user
    will make connection successfully using above generated
    connection's metadata or submit verification requests
    successfully
*/
router.post('/webhook', async (req, res) => {
    try {

        const {
            message_type,
            object_id
        } = req.body;

        if (message_type == "new_connection") {

            const userDetails = await getConnectedUserDetails(object_id);
            // showConsole(`Connection Result\nJSON OUTPUT: ${JSON.stringify(req.body, null, 4)}\n\nConnected User Details\n${JSON.stringify(userDetails, null, 4)}\n\n`);

            const ansAction = await askAction.run();

            if (ansAction == 'Issue Credential') {
                const ansCredDef = await askCredDef.run();
                const ansIdentifier = await askIdentifier.run();
                let identifiersToArray = ansIdentifier.split(',');
                let credentialsObject = {};

                for (const key in identifiersToArray) {
                    credentialsObject[identifiersToArray[key]] = await getIdentifierValue(identifiersToArray[key]);
                }

                await issueCredential(ansCredDef, credentialsObject);
            }

            if (ansAction == 'Credential Verification') {

            }
        }
        else {
            // const credentialData = await getVerificationDetails(req.body.object_id);
            // showConsole(`Verification Result\n${JSON.stringify(req.body)}\n\nUser Credential Data\n${JSON.stringify(credentialData, null, 4)}`);
        }
    } catch (error) {
        showConsole(error.message);
    }
});

const getConnectedUserDetails = async (connectionId) => {
    try {
        const result = await axios({
            url: `${process.env.CORE_API_URL}/api/connection/get_connection`,
            method: 'GET',
            params: {
                connectionId: connectionId,
            },
            headers: {
                'Authorization': `Bearer ${store.get('TOKEN')}`
            }
        });

        // Decoding name property from connection details
        const encodedName = result.data.connection.name;
        var bufferedString = Buffer.from(encodedName, 'base64');
        const decodedString = bufferedString.toString('utf8');
        let decodedParts = decodedString.split(':');

        let userData = {
            phone: decodedParts[1],
            name: decodedParts[2],
            userId: decodedParts[3],
            connectionId
        }

        store.put('USER', userData);

        return userData;

    } catch (error) {
        showConsole(`Getting user details got error ${error.message}\n\n`);
    }
}

module.exports = router;