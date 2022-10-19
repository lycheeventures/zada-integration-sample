if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const ngrok = require('ngrok');
const WebhookServicesClass = require('./services/Webhook');
const ConnectionServicesClass = require('./services/Connection');
const AuthServices = require('./services/Auth');
const { askConnectionName } = require('./helper/cli_inputs');
const { showConsole } = require('./helper/utils');
const { generateQr } = require('./helper/qr');

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

app.use((req, res, next) => {
    showConsole(`${req.method} ${req.originalUrl}`);
    next();
});

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

    // store.get('WEBHOOK') && await WebhookServicesClass.deleteWebhook(store.get('WEBHOOK').id);

    const NGROK_URL = await ngrok.connect({ proto: 'http', addr: 'http://localhost:7500' });

    console.log(`Server is listening on\nURL: ${NGROK_URL}\nPORT: ${PORT}\n\n`);

    // Authenication with Core API to execute all end points
    await AuthServices.authenticateTenant();
    // 
    await WebhookServicesClass.createWebhook(`${NGROK_URL}/${process.env.WEBHOOK_ROUTE}`);

    // Get Connection name from user using CLI
    const ansConnectionName = await askConnectionName.run();
    
    // Register Webhook it will trigger after creating connection and verification
    let connection = await ConnectionServicesClass.createConnection(ansConnectionName);

    // new URL object
    const current_url = new URL(connection.zadaQR);

    // get access to URLSearchParams object
    const search_params = current_url.searchParams;

    // get url parameters
    const qrData = JSON.parse(search_params.get('data'));

    // Generate QR against connection name
    generateQr(qrData);

});
/****** RUNNING EXPRESS SERVER ENDS ******/

