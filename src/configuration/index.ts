import dotenvFlow from "dotenv-flow";

// Read from .env file and/or environment
dotenvFlow.config();

export default {
  bitpay: {
    configFile: __dirname + "/../../secure/BitPay.config.json",
  },
  express: {
    port: process.env.EXPRESS_PORT || 3001,
  },
  ngrok: {
    authToken: process.env.NGROK_AUTHTOKEN,
    domain: process.env.NGROK_DOMAIN || "",
  },
};
