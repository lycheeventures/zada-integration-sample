# Mobile Implementation

# Usage

1. Create a button in your mobile application.
2. Create a JSON Object and convert it to base64.
3. On button click, open ZADA deeplink and pass the base64 object as a query parameter.

## Steps

1. Pass <b>type</b> as "connectionless-verification".
2. Pass <b>metadata</b> object containing policyId and tenantId.
3. Pass <b>policyId</b> as argument. You can get <b>policyId</b> from the [policies section](policies.md)
4. You can get <b>tenantId</b> from the tenant that you have created in the tenant section.
5. Pass <b>rcb</b> as redirect-url. This will be called by ZADA Wallet after successful verification. You can pass a deeplink to your application to make sure that user returns back to your application from ZADA Wallet.
6. Pass <b>wcb</b> as webhook-url. This will be called by ZADA Wallet after successful verification. You can pass a webhook URL to receive verification data.

```sh
let jsonObject = {
    “type”: "connectionless-verification",
    “metadata”: {
      “policyId”: "policyId",
      “tenantId”: "your-tenant-Id”,
    },
    “rcb”: "redirect-url",
    “wcb”: "webhook-url",
  }
```

Convert this object into Base64 and forward it to ZADA deeplink:

```sh
zada://network/connectionless-verification?data=${jsonObjectInBase64}
```
