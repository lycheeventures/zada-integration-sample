const { showConsole } = require('../helper/utils');
const axios = require('axios');

const { getMemoryValue, setMemoryValue } = require('../cache.js');

if (process.env.NODE_ENV === 'debug')
    require('dotenv').config({ path: '.local.env' });
else
    require('dotenv').config({ path: '.test.env' });

class WebhookServicesClass {

    /**
     * Function to create webhook will trigger after create new connection
     * @param {String} webhook 
     */
    createWebhook = (webhook) => {

        return new Promise((resolve, reject) => {
            try {

                showConsole(`Creating Webhook ${webhook}`);

                axios({
                    url: `${process.env.CORE_API_URL}/api/webhook/create_webhook`,
                    method: 'POST',
                    data: {
                        endpointUrl: webhook,
                    },
                    headers: {
                        'Authorization': `Bearer ${getMemoryValue('TOKEN')}`
                    }
                }).then((response) => {
                    setMemoryValue('WEBHOOK', response.data.webhook);
                    showConsole(`Webhook is created successfully\n\n`);
                    resolve(true);
                }).catch((error) => {
                    showConsole(`Creating webhook got error ${error.message}\n\n`);
                    resolve(false)
                });


            } catch (error) {
                showConsole(`Creating webhook got error ${error.message}\n\n`);
                reject(error)
            }
        })
    }

    /**
    * Function to delete existing webhook
    * @param {String} webhookId 
    */
    deleteWebhook = (webhookId) => {

        return new Promise((resolve, reject) => {
            try {

                showConsole(`Delete Webhook ${webhookId}`);

                axios({
                    url: `${process.env.CORE_API_URL}/api/webhook/delete_webhook`,
                    method: 'POST',
                    data: {
                        webhookId: webhookId,
                    },
                    headers: {
                        'Authorization': `Bearer ${getMemoryValue('TOKEN')}`
                    }
                }).then((response) => {
                    resolve(true);
                }).catch((error) => {
                    showConsole(`Deleting webhook got error ${error.message}\n\n`);
                    resolve(false)
                });

                showConsole(`Webhook is deleted successfully\n\n`);

            } catch (error) {
                showConsole(`Deleting webhook got error ${error.message}\n\n`);
                reject(error)
            }
        })
    }

}

const WebhookServices = new WebhookServicesClass;

module.exports = WebhookServices;
