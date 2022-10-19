const router = require("express").Router();
const { showConsole } = require('../helper/utils');
const { askAction } = require('../helper/cli_inputs');
const AuthServices = require('../services/Auth');
const IssuanceServices = require('../services/Issuance');
const VerificationServices = require('../services/Verification');

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

            const userDetails = await AuthServices.getConnectedUserDetails(object_id);
            // showConsole(`Connection Result\nJSON OUTPUT: ${JSON.stringify(req.body, null, 4)}\n\nConnected User Details\n${JSON.stringify(userDetails, null, 4)}\n\n`);

            const ansAction = await askAction.run();

            if (ansAction == 'Issue Credential') {

                // Credentials Definition 
                const CREDDEF = process.env.CREDDEF;

                // Data Object bind with cred def 
                const CREDENTIALS_OBJECT = {
                    Name: 'Shahzaib',
                    Age: '27',
                    Country: 'Pakistan'
                };

                // Issue Credentials Function that send data to your ZADA WALLET
                await IssuanceServices.issueCredential(CREDDEF, CREDENTIALS_OBJECT);
            }

            if (ansAction == 'Credential Verification') {

                // Send Verification Request to your ZADA WALLET
                await VerificationServices.sendVerificationRequest(object_id);

            }
        }

        if (message_type == "verification") {

            const credentialData = await VerificationServices.getVerificationDetails(object_id);
            showConsole(`Verification Result\n${JSON.stringify(req.body)}\n\nUser Credential Data\n${JSON.stringify(credentialData, null, 4)}`);

        }

    } catch (error) {
        showConsole(error.message);
    }
});

module.exports = router;