const router = require("express").Router();
const { showConsole } = require('../helper/utils');
const { askAction, askVerification } = require('../helper/cli_inputs');
const AuthServices = require('../services/Auth');
const IssuanceServices = require('../services/Issuance');
const VerificationServices = require('../services/Verification');
const WebhookServicesClass = require('../services/Webhook');
const { getMemoryValue } = require('../cache');

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
                    Name: 'Test Name',
                    Age: '27',
                    Country: 'Pakistan'
                };

                console.log(`\n issuing...`);

                // Issue Credentials Function that send data to your ZADA WALLET
                await IssuanceServices.issueCredential(CREDDEF, CREDENTIALS_OBJECT);

                const ansVerification = await askVerification.run();

                if (ansVerification == 'YES') {
                    // Send Verification Request to your ZADA WALLET
                    await VerificationServices.sendVerificationRequest(object_id);
                }
                if (ansVerification == 'NO') {
                    // Delete Webhook after process complete to over come junk data
                    await WebhookServicesClass.deleteWebhook(getMemoryValue('WEBHOOK').id);
                }
            }

            if (ansAction == 'Credential Verification') {

                // Send Verification Request to your ZADA WALLET
                await VerificationServices.sendVerificationRequest(object_id);

            }
        }

        if (message_type == "verification") {

            // Fetch user verification status by passing connectionId
            const credentialData = await VerificationServices.getVerificationDetails(object_id);
            showConsole(`Verification Result\n${JSON.stringify(req.body)}\n\nUser Credential Data\n${JSON.stringify(credentialData, null, 4)}`);

            // Delete Webhook after process complete to over come junk data
            await WebhookServicesClass.deleteWebhook(getMemoryValue('WEBHOOK').id);
        }

    } catch (error) {
        showConsole(error.message);
    }
});

module.exports = router;