const config = {
  env: process.env.NODE_ENV,
  intercom: {
    token: process.env.INTERCOM_TOKEN ?? "",
    adminId: process.env.INTERCOM_ADMIN_ID ?? "",
    outboundMessage: process.env.INTERCOM_OUTBOUND_MESSAGE ?? "",
  },
  realm: {
    url: process.env.REALM_API_URL,
  },
  logger: {
    level: process.env.LOG_LEVEL || "debug",
  },
};

export default config;
