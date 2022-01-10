if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const moment = require('moment');
const axios = require('axios').default;
const ngrok = require('ngrok');

let TOKEN = '';

/**
 * Function to show console logs in specified format
 * @param {String} message 
 */
const showConsole = (message) => {
    console.log(`Time: ${moment().format('DD/MM/YYYY')} ~ ${message}`);
}

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
const getConnectedUserDetails = async (connectionId) => {
    try {
        const result = await axios({
            url: `${process.env.CORE_API_URL}/api/connection/get_connection`,
            method: 'GET',
            params: {
                connectionId: connectionId,
            },
            headers: {
                'Authorization': `Bearer ${TOKEN}`
            }
        });

        // Decoding name property from connection details
        const encodedName = result.data.connection.name;
        var bufferedString = Buffer.from(encodedName, 'base64');
        const decodedString = bufferedString.toString('utf8');
        let decodedParts = decodedString.split(':');
        return {
            phone: decodedParts[1],
            name: decodedParts[2],
            userId: decodedParts[3],
        }
    } catch (error) {
        showConsole(`Getting user details got error ${error.message}\n\n`);
    }
}

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
        showConsole(`Verification request is sent successfully for connectionId ${connectionId} and policyId ${policyId}`);
    } catch (error) {
        showConsole(`Sending verification request is failed due to ${error.message}\n\n`);
    }
}

/****** SERVER ROUTES STARTS ******/

// Route to check is server running
app.get('/', (req, res) => {
    res.status(200).json({ success: true })
})

/****** SERVER ROUTES ENDS ******/
/*
    This webhook will be triggered when ZADA Wallet user
    will make connection successfully using above generated
    connection's metadata or submit verification requests
    successfully
*/
app.post('/webhook', async (req, res) => {
    try {
        const {
            message_type,
            object_id
        } = req.body;

        if (message_type == "new_connection") {
            const userDetails = await getConnectedUserDetails(object_id);
            showConsole(`Connection Result\nJSON OUTPUT: ${JSON.stringify(req.body, null, 4)}\n\nConnected User Details\n${JSON.stringify(userDetails, null, 4)}\n\n`);
            await sendVerificationRequest(object_id);
        }
        else {
            const credentialData = await getVerificationDetails(req.body.object_id);
            showConsole(`Verification Result\n${JSON.stringify(req.body)}\n\nUser Credential Data\n${JSON.stringify(credentialData, null, 4)}`);
        }
    } catch (error) {
        showConsole(error.message);
    }
});

/****** RUNNING EXPRESS SERVER STARTS ******/
app.listen(PORT, async function () {
    const NGROK_URL = await ngrok.connect({ proto: 'http', addr: 'http://localhost:7500' });
    console.log(`Server is listening on\nURL: ${NGROK_URL}\nPORT: ${PORT}\n\n`);
    await authenticateTenant();
    await createWebhook(`${NGROK_URL}/${process.env.WEBHOOK_ROUTE}`);
    await createConnection(process.env.CONNECTION_NAME);
});
/****** RUNNING EXPRESS SERVER ENDS ******/

