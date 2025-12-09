---
---

# Authentication

The SavvyCal REST API is authenticated via bearer tokens. To make authenticated requests, include the API token in the `Authorization` header:

```http
Authorization: Bearer <your-api-token>
```

There are a few different types of tokens you can use, depending on the context of your request.

## Account API tokens

Account API tokens are long-lived and intended for server-side requests to the SavvyCal API for a single account.

To create one, go to [Settings &rarr; API tokens](https://savvycal.app/tokens) in the SavvyCal Dashboard and follow the prompts. You can only view the token once, so store it securely.

## Platform API tokens

Platform API tokens are long-lived and intended for server-side requests to the SavvyCal API on behalf of multiple accounts.

To create one, open your platform’s settings in the SavvyCal Dashboard (via the top-left menu) and follow the prompts. You’ll only be able to view the token once, so store it securely.

When using a platform token, most endpoints require you to include the account ID in the request headers.

```http
Authorization: Bearer <your-platform-token>
X-SavvyCal-Account: <account-id>
```

## JSON Web Tokens

JSON Web Tokens (JWTs) are short-lived tokens used for client-side requests to the SavvyCal API on behalf of a specific user.

How it works:

1. Your server generates a JWT, signed with a signing key you create in the SavvyCal Dashboard.
2. Your server sends the JWT to your client.
3. The client includes the JWT in the `Authorization` header for API requests.

To create a signing key, go to [Settings &rarr; Signing keys](https://savvycal.app/signing_keys) in the SavvyCal Dashboard. You can only view the Private Key once, so store it securely.

A Private Key (PEM format) looks like this:

```
-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQg3znxFBcKjgwaN4wF
Ucef2XQOkJCCcAonUwDwQQbXpm2hRANCAATJ4WS1J2k+ZrvbkUFfYwUc2ucFANMf
iVmGsbSVWKSXqDMOv7Sjd4tcznUROsO4j3EEpm66kkez7iMJ2gOhHmjK
-----END PRIVATE KEY-----

```

Your JWT must:

- Use the `ES256` algorithm.
- Include the `kid` header (e.g. `kid_f05b815d1852`).
- Include the `sub` claim with the target user ID (e.g. `user_0987654321`).
- Include the `exp` claim with a short expiration (e.g. one hour).

Most languages have JWT libraries available (see [jwt.io/libraries](https://jwt.io/libraries)). We've included a few examples below to get you started.

### JavaScript

Here's an example of how to create and sign a JWT using the `jsonwebtoken` library in Node.js:

```javascript
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Read your private key from a secure location
const privateKey = fs.readFileSync('path/to/private-key.pem', 'utf8');

// Your signing key ID from the SavvyCal Dashboard
const kid = 'kid_f05b815d1852';

// Create the JWT payload with a reasonbly short expiration time (e.g., 1 hour)
const payload = {
  sub: 'user_0987654321',
  exp: Math.floor(Date.now() / 1000) + (60 * 60)
};

// Sign the JWT
const token = jwt.sign(payload, privateKey, {
  algorithm: 'ES256',
  header: {
    kid: kid
  }
});

console.log(token);
```

Install the required package:

```bash
npm install jsonwebtoken
```

### Ruby

Here's an example of how to create and sign a JWT using the `jwt` gem in Ruby:

```ruby
require 'jwt'
require 'openssl'

# Read your private key from a secure location
private_key = OpenSSL::PKey::EC.new(File.read('path/to/private-key.pem'))

# Your signing key ID from the SavvyCal Dashboard
kid = 'kid_f05b815d1852'

# Create the JWT payload with a reasonbly short expiration time (e.g., 1 hour)
payload = {
  sub: 'user_0987654321',
  exp: Time.now.to_i + 3600
}

# Sign the JWT
token = JWT.encode(payload, private_key, 'ES256', { kid: kid })

puts token
```

Install the required gem:

```bash
gem install jwt
```
