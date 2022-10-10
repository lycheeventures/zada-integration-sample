if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const axios = require('axios').default;
const ngrok = require('ngrok');
const QRCode = require('qrcode');
const { showConsole } = require('./helper/utils');
const { askWebhookUrl, askWebhook, askAction } = require('./helper/cli_inputs');
var Storage = require('node-storage');
var store = new Storage('cache');
const { issueCredential } = require('./api/issueCred');

let TOKEN = '';

/**
 * Function to show console logs in specified format
 * @param {String} message 
 */

/****** INITIALIZING EXPRESS SERVER STARTS ******/
const app = express();
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
const PORT = process.env.PORT || 7500;
/****** INITIALIZING EXPRESS SERVER ENDS ******/

/****** CAPTURING UNEXPECTED ERROR STARTS ******/
process.on('uncaughtException', function (err) {
    showConsole(err.message);
});
/****** CAPTURING UNEXPECTED ERROR ENDS ******/

/*
    Function to log API Calls
*/
app.use((req, res, next) => {
    showConsole(`${req.method} ${req.originalUrl}`);
    next();
});

/**
 * Function to authenticate ZADA tenant
 */
const authenticateTenant = async () => {
    try {
        const result = await axios({
            url: `${process.env.CORE_API_URL}/api/authenticate`,
            method: 'POST',
            data: {
                tenantId: process.env.TENANT_ID,
                secretPhrase: process.env.TENANT_SECRET,
            }
        });

        TOKEN = result.data.token;
        store.put('TOKEN', TOKEN);

        showConsole(`${process.env.TENANT_ID} Tenant is successfully authenticated\n\n`);
    } catch (error) {
        showConsole(`Authentication got error ${error.message}\n\n`);
    }
}

/**
 * Function to create metadata for given connectionName.
 * ZADA Wallet user can easily use metadata to make connection
 * with it.
 * @param {String} connectionName 
 */
const createConnection = async (connectionName) => {
    try {
        showConsole(`Creating Connection...`);
        const result = await axios({
            url: `${process.env.CORE_API_URL}/api/connection/create_connection`,
            method: 'POST',
            data: {
                name: connectionName,
            },
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        showConsole(`Connection is created successfully against name ${connectionName}\nJSON OUTPUT\n${JSON.stringify(result.data.connection, null, 4)}\n\nOpen this URL in browser and scan with ZADA Wallet App to make Connection: ${result.data.connection.zadaURL}\n\n`);
    } catch (error) {
        showConsole(`Creating Connection got error for name ${error.message}\n\n`);
    }
}

/**
 * Function to get connection details for connected user's connectionId
 * @param {String} connectionId 
 * @returns 
 */

/**
 * Function to get verification details for user's submitted verification
 * @param {String} verificationId 
 * @returns 
 */
const getVerificationDetails = async (verificationId) => {
    try {
        const result = await axios({
            url: `${process.env.CORE_API_URL}/api/credential/get_verification_status`,
            method: 'GET',
            params: {
                verificationId: verificationId,
            },
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });

        const policyName = result.data.verification.policy.attributes[0].policyName;
        return result.data.verification.proof[policyName].attributes;
    } catch (error) {
        showConsole(`Getting Verification details got error ${error.message}\n\n`);
    }
}

const createWebhook = async (webhook) => {
    try {
        showConsole(`Creating Webhook ${webhook}`);
        await axios({
            url: `${process.env.CORE_API_URL}/api/webhook/create_webhook`,
            method: 'POST',
            data: {
                endpointUrl: webhook,
            },
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        showConsole(`Webhook is created successfully\n\n`);
    } catch (error) {
        showConsole(`Creating webhook got error ${error.message}\n\n`);
    }
}

/**
 * Function to send verification request to already connected
 * ZADA Wallet user.
 * @param {String} connectionId 
 * @param {String} policyId 
 */
const sendVerificationRequest = async (connectionId) => {
    try {
        showConsole('Sending verification request...');
        await axios({
            url: `${process.env.CORE_API_URL}/api/credential/submit_verification`,
            method: 'POST',
            data: {
                connectionId: connectionId,
                policyId: process.env.POLICY_ID
            },
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });
        showConsole(`Verification request is sent successfully for connectionId ${connectionId}`);
    } catch (error) {
        showConsole(`Sending verification request is failed due to ${error.message}\n\n`);
    }
}


// Generate QR
const generateQr = () => {

    // Creating the data
    let data = {
        type: "connection_request",
        metadata: "99375be8-2932-4597-881e-de8a5810e1b4"
    }

    // Converting the data into String format
    let stringdata = JSON.stringify(data)

    // Print the QR code to terminal
    QRCode.toString(stringdata, { type: 'terminal', small: true },
        function (err, QRcode) {
            if (err) return console.log("error occurred")
            // Printing the generated code
            console.log(QRcode)
        })

}
// Generate QR


/****** SERVER ROUTES STARTS ******/

// Route to check is server running
app.get('/', (req, res) => {
    res.status(200).json({ success: true })
});

const api = {
    webhooks: require("./api/webhooks"),
};

app.use("/", api.webhooks);

/****** SERVER ROUTES ENDS ******/


/****** RUNNING EXPRESS SERVER STARTS ******/
app.listen(PORT, async function () {
    store.remove('TOKEN');
    store.remove('USER');
    // const ansAction = await askAction.run();

    // if (ansAction == 'Create New Connection') {

    const ansWebhook = await askWebhook.run();
    let WEBHOOK_URL = '';

    if (ansWebhook == 'YES') {
        const ansWebhookUrl = await askWebhookUrl.run();
        WEBHOOK_URL = ansWebhookUrl;
    } else {
        const NGROK_URL = await ngrok.connect({ proto: 'http', addr: 'http://localhost:7500' });
        WEBHOOK_URL = NGROK_URL;
    }

    // console.log(`Server is listening on\nURL: ${WEBHOOK_URL}\nPORT: ${PORT}\n\n`);
    await authenticateTenant();
    await createWebhook(`${WEBHOOK_URL}/${process.env.WEBHOOK_ROUTE}`);

    generateQr();
    // }

});
/****** RUNNING EXPRESS SERVER ENDS ******/

