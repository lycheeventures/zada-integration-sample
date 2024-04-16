# POLICIES

Policies are underlining structure to verify credentials.

<p>Test API endpoints is: https://test.zadanetwork.com/api</p>
<p>Production API endpoints is: https://core.zadanetwork.com/api</p>

# Usage

1. Authorize using tenant Id and secret phrase.
2. Tenant Id and secret phrase will be in your email after you have onboarded with as a tenant on ZADA network.

# API'S:

1. Create a new policy.
2. Get all existing policies.
3. Delete an existing policy.

## Authentication

Authentication is required for accessing most endpoints. The API uses JWT (JSON Web Tokens) for authentication. To authenticate, include the JWT token in the Authorization header of your requests.

### Steps

1. Pass an argument tenantId, which is the tenant Id that you have received in your email provided by ZADA.
2. Pass an argument secretPhrase, which is the tenant password that you have received in your email provided by ZADA.

```sh
POST /authenticate
Content-Type: application/json
{
   "tenantId": "your-tenant-Id”,
   "secretPhrase": "your-tenant-password",
}
```

#### Response:

```sh
{
    "success": true,
    "token": "jwt-token",
    "iat": 1713188546,
    "exp": 1713189146
}
```

## Get All Policies

This API call is used to list policies that are registered in your zada-ecosystem.

Authorization: Bearer {{token}}

### Steps

1. Authenticate using tenant Id and secret phrase.
2. Get all policies.

```sh
GET /policy/get_all_policies
Content-Type: application/json
Authorization: Bearer {{token}}
```

#### Response:

```sh
{
    "success": true,
    "policies": [
        {
            "_id": "64ddfe68b962e001234db449",
            "name": "verification-name-that-you-passed-in-create-policy",
            "tenantId": "your-tenant-Id",
            "policyId": "f5286830-c244-4d63-944a-12345c71cb87",
            "verificationRequestData": "eyJuYW1lIjogIlNhbXBsZSBWZXJpZmljYXRpb24iLCJ2ZXJzaW9uIjogIjEuMCIsInJlcXVlc3RlZF9hdHRyaWJ1dGVzIjogeyJTYW1wbGUgVmVyaWZpY2F0aW9uIjogeyAibmFtZXMiOiBbIlR5cGUiLCJGdWxsIE5hbWUiLCJHZW5kZXIiLCJCaXJ0aCBEYXRlIl0sICJyZXN0cmljdGlvbnMiOiBbeyJzY2hlbWFJZCI6ICJBd0RKQXNmRVJUdGpKNDJSZjlWQVNQOjI6c2FtcGxlU2NoZW1hOjEuMCIsICJpc3N1ZXJEaWQiOiAiUUVTVUhhbTRSVFl3RW9KZkJMWDhWbSJ9XSB9fSwicmVxdWVzdGVkX3ByZWRpY2F0ZXMiOiB7fSwibm9uX3Jldm9rZWQiOiB7ICJmcm9tIjogMCwgInRvIjogODQxMDk5OTI1OCB9fQ==",
            "version": "1.0",
            "createdAt": "2024-03-20T06:46:36.055Z",
            "updatedAt": "2024-03-20T06:46:36.055Z",
            "__v": 0
        },
        ....
    ]
}
```

## Create Policy

This API call is used to register a new policy in your zada-ecosystem.

Authorization: Bearer {{token}}

### Steps

1. Authenticate using tenant Id and secret phrase.
2. Pass an argument name as policy name. This could be any name that you want to give to your policy.
3. Pass an argument requestedAttributes as a list of attributes separated by commas , that you want to verify. This could be any attributes that you want to verify.
4. Pass an argument schemaIdRestriction as a schemaId. This is optional. If you want to restrict the verification to a particular schemaId, you can pass the schemaId here.
5. Pass an argument issuerDidRestriction as an issuerDid. This is optional. If you want to restrict the verification to a particular tenant, you can pass the issuerDid here.
6. Pass an argument version as a version. This is optional. If you want to pass a version to your policy, you can pass the version
7. Create a policy.

```sh
POST /policy/create_policy
Content-Type: application/json
Authorization: Bearer {{token}}
{
   "name": "policy-name",
   "requestedAttributes": "attribute-names-that-needs-to-be-verified",  // name, age, country...
   "schemaIdRestriction": "schema-id", // Restrict the schemaId for verification (Optional)
   "issuerDidRestriction": "issuer-did", // Restrict verification to a particular tenant (Optional)
   "version": "", // 1.0 (Optional)
}
```

#### Response:

```sh
{
    "success": true,
    "message": "Policy created successfully",
    "policy": {
        "_id": "64ddfe68b962e001234db449",
        "name": "verification-name-that-you-passed-in-create-policy",
        "tenantId": "your-tenant-Id",
        "policyId": "f5286830-c244-4d63-944a-12345c71cb87",
        "verificationRequestData": 'eyJuYW1lIjogIlNhbXBsZSBWZXJpZmljYXRpb24iLCJ2ZXJzaW9uIjogIjEuMCIsInJlcXVlc3RlZF9hdHRyaWJ1dGVzIjogeyJTYW1wbGUgVmVyaWZpY2F0aW9uIjogeyAibmFtZXMiOiBbIlR5cGUiLCJGdWxsIE5hbWUiLCJHZW5kZXIiLCJCaXJ0aCBEYXRlIl0sICJyZXN0cmljdGlvbnMiOiBbeyJzY2hlbWFJZCI6ICJBd0RKQXNmRVJUdGpKNDJSZjlWQVNQOjI6c2FtcGxlU2NoZW1hOjEuMCIsICJpc3N1ZXJEaWQiOiAiUUVTVUhhbTRSVFl3RW9KZkJMWDhWbSJ9XSB9fSwicmVxdWVzdGVkX3ByZWRpY2F0ZXMiOiB7fSwibm9uX3Jldm9rZWQiOiB7ICJmcm9tIjogMCwgInRvIjogODQxMDk5OTI1OCB9fQ==',
        "version": '1.0',
        "createdAt": "2024-04-16T09:23:11.552Z",
        "updatedAt": "2024-04-16T09:23:11.552Z",
        "__v": 0
    }
}
```

## Delete Policy

This API call is used to remove a policy from your zada-ecosystem.

Authorization: Bearer {{token}}

### Steps

1. Authenticate using tenant Id and secret phrase.
2. Pass an argument policyId as policy Id that you want to delete.
3. Delete a policy.

```sh
DELETE /policy/delete_policy
Content-Type: application/json
Authorization: Bearer {{token}}
{
   "policyId": "policyId",
}
```

#### Response:

```sh
{
    "success": true,
    "message": "Policy deleted successfully"
}
```
