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

## Intercom

# App

https://app.intercom.com/a/apps/kfms5gdr/developer-hub/app-packages/83917/basic-info

# Run local

Start dev server:

```bash
yarn dev
```

## Create Local Tunnel so realm mobile doesn't complain about non-https

- register an account with ngrok, register a local token
- ngrok http 3000 --subdomain realm-intercom
- in realm-native app > .env.development > fill ADVISORY_API_URL=<ngrok https url>/api/advisory

# Branches

Branches:

- prod: https://realm-intercom.vercel.app -> points to prod realm/intercom
- staging: https://realm-intercom-git-staging-gblejman.vercel.app -> points to staging realm/intercom

# Api

- GET [url]/api/config: info about the environment running
- GET [url]/api/advisory/conversation: fetches user conversation, sets it up if missing
- POST [url]/api/advisory/conversation/reply: replies user conversation
- GET [url]/api/setup: pre-emptively sets a conversation if missing
- POST [url]/api/webhook: called by intercom with subscription event data

# CAVEATS

Will temp use `user.social_facebook` field to persist the linking, until properly added in schema and user model

```js
JSON.stringify({
  intercom_contact_id: string | null,
  intercom_conversation_id: string | null,
});
```
