<h1>ZADA CORE API TUTORIAL</h1>

# Description
<p>
This is a demo related to ZADA Core API, in which tenant can make connection, issue credentials and send verification request. 
Also tenant can create webhook to issue credentials, connection acceptance and verification submission 
from ZADA Wallet mobile application.
</p>

# How to run
<p>
To run the application successfully, please follow these steps:
</p>
<ol>
  <li>
    Clone repo using this command <code>git clone REPO URL</code>
  </li>
  <li>
    Use this command to install node modules <code>npm install</code>
  </li>
  <li>
    Change .test.env variables according to your values
  </li>
  <li>
    Use this command to start the app <code>npm run test</code>
  </li>
</ol>

# Environment
<ol>
  <li>
    Node v12.16.3
  </li>
  <li>
    npm 6.14.4
  </li>
</ol>

# Usage

<p>Below mentioned some code of core functions</p>

>This code is used to register webhook url in core api by passing url parameter that will trigger when new connection and verification request action occur.

```JavaScript
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
```

>This piece of code used to issued credentials to your wallet by passing credential definition and data object that you want to send.

```JavaScript
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
                  resolve(true);
              }).catch((data) => {
                  showConsole("issueCredential fetch catch:", data);
                  reject(false);
              })

      } catch (error) {
          showConsole(`Issue Credential got error ${error.message}\n\n`);
          reject(error)
      }
  })
}
```

>This code is used to send credential verification to your wallet by passing connectionId parameter.

```JavaScript
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
```

# Watch demo video

[![Watch the video](http://i.imgur.com/ia3Jrgc.png)](https://www.loom.com/embed/147ade51ae9b4f70b249e6f7c01bf288)

