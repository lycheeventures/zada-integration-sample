<h1>ZADA CORE API TUTORIAL</h1>

# Description
<p>
This is a demo related to ZADA Core API, in which tenant can make connection, issue credentials and send verification request. 
Also tenant can create webhook to issue credentials, connection acceptance and verification submission 
from ZADA Wallet mobile application.
</p>

# How to run
<p>To run the application successfully, please follow these steps:</p>
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

# Working & Usage

<p>Below mentioned steps shows the working of core api</p>

* Initially you have to install ZADA Wallet Test App (IOS/ANDROID).
* Start test server using <code>npm run test</code> command.
* After server running it'll authenticate with core api on the basis of <code>Tenant Id</code> & <code>Tenant Secret</code>
* After authentication complete, It'll register webhook to perform actions like credentials issuance or verification furthermore you can put your on webhook url just a little bit change in code. [Code Reference](https://github.com/ssiddiqui-alabz/zada-core-tutorial/blob/98ff4ca753ed79697f5eab5c8f6168586d6f5077/server.js#L67)
* It'll ask for connection name to create new connection for mobile and web server connection establishment. [Code Reference](https://github.com/ssiddiqui-alabz/zada-core-tutorial/blob/98ff4ca753ed79697f5eab5c8f6168586d6f5077/server.js#L73)
* After that you can see a QR visible in cli scan it with you ZADA App to establish connection.
* Now it'll ask you either you want to <code>issue credentials [Code Reference](https://github.com/ssiddiqui-alabz/zada-core-tutorial/blob/98ff4ca753ed79697f5eab5c8f6168586d6f5077/services/Issuance.js#L23)</code> or <code>verification [Code Reference](https://github.com/ssiddiqui-alabz/zada-core-tutorial/blob/98ff4ca753ed79697f5eab5c8f6168586d6f5077/services/Verification.js#L11)</code> select your choice if you choose issuance then you'll get demo credentials on your wallet other than if you choose verification then you'll receive verification request.

>NOTE:
<p>Please Watch Demo Video for your better understanding.</p>


# Watch demo video

[![Watch the video](http://i.imgur.com/ia3Jrgc.png)](https://www.loom.com/embed/147ade51ae9b4f70b249e6f7c01bf288)

