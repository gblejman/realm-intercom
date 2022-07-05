# Realm - Intercom

# Setup

## Local Setup

Copy env.example into .env.[production|test|development].local and fill values for each env

## Non Local Setup

Go to project's settings/environment-variables and create an env vars for each env

## Env vars

- INTERCOM_TOKEN: the intercom app access token
- INTERCOM_ADMIN_ID: the workspace admin user id used to send the first outbound message
- INTERCOM_OUTBOUND_MESSAGE: the outbound message sent when first creating the advisor conversation
- REALM_API_URL: the realm api url

## References

Intercom App:

- Dev: https://app.intercom.com/a/apps/kfms5gdr/developer-hub/app-packages/83917/basic-info - Realm [TEST] workspace
- Prod: <not yet promoted from test to prod>

# Run local

Start dev server:

```bash
yarn dev
```

# Check env

Local: GET http://localhost:3000/api/config
Vercel: GET [deploymentUrl]/api/config

# CAVEATS

Will temp use `user.social_facebook` field to persist the linking, until properly added in schema and user model

```js
JSON.stringify({
  intercom_contact_id: string | null,
  intercom_conversation_id: string | null,
});
```
