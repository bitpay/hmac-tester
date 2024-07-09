# BitPay Webhook Validator

## Overview

This project can be used to create invoices, refunds, payouts, and other
resources, and will listen for webhooks. It utilizes [Ngrok](https://ngrok.com/)
to create a temporary public tunnel to your local application.

> NOTE: Do not run this on a public server. It creates resources, albeit in the
> test environment and this application does not have any authentication. It is
> intended for testing ONLY.

## To-do

- Improve exception chain
- Add more endpoints

## Prerequisites

- Node.js >= 18
- Ngrok account
  - Add a static domain under Cloud Edge > Domains
  - Enable Full Capture under Settings > Account > Observability

## Environment Variables

| Environment Variable | Description                                               |
| -------------------- | --------------------------------------------------------- |
| EXPRESS_PORT         | Port to run express on, defaults to 3001                  |
| NGROK_AUTHTOKEN      | Ngrok token                                               |
| NGROK_DOMAIN         | Ngrok domain, defaults to empty string for dynamic domain |

## Configuration

- Create a working Node.js BitPay.config.json in the `secure/` directory
- Copy `.env.sample` to `.env`
- Populate the `NGROK_AUTHTOKEN` environment variable in `.env`
- Populate the `NGROK_DOMAIN` environment variable in `.env`
- Start the application with `npm run start`

## Endpoints

The following endpoints are available. Note that this is not a RESTful API, so
the endpoints are semantic.

| Endpoint                              | Description                                                                |
| ------------------------------------- | -------------------------------------------------------------------------- |
| POST /bitpay/createInvoice            | Create an invoice                                                          |
| POST /bitpay/createAndPayInvoice      | Create and pay an invoice                                                  |
| POST /bitpay/refundInvoice/:invoiceId | Create a refund                                                            |
| POST /bitpay/createPayout             | Create a payout                                                            |
| POST /bitpay/inviteRecipient          | Invite a payout recipient - requires a JSON body with an "email" property. |
| GET /health                           | Simple health check                                                        |
| POST /webhook-validator               | Used for validating inbound webhooks                                       |

Review the console for webhook validations, which should have output like this:

```javascript
{
  event: 'invoice_completed',
  token: '*****REDACTED*****',
  body: '{"data":{"id":"LXXgiWHZuKbt9yurP5RpMQ","url":"https://test.bitpay.com/invoice?id=LXXgiWHZuKbt9yurP5RpMQ","status":"complete","price":100,"currency":"USD","invoiceTime":1720196480461,"expirationTime":1720197380461,"currentTime":1720196481431,"exceptionStatus":false,"buyerFields":{"buyerName":"Test","buyerAddress1":"168 General Grove","buyerCity":"Port Horizon","buyerState":"New Port","buyerZip":"KY7 1TH","buyerCountry":"AD","buyerPhone":"+990123456789","buyerNotify":true,"buyerEmail":"test@email.com"},"paymentSubtotals":{"BTC":176951,"BCH":31036600,"ETH":33503000000000000,"GUSD":10000,"PAX":100000000000000000000,"BUSD":100000000000000000000,"USDC":100000000,"XRP":235806580,"DOGE":96127965500,"LTC":163025800,"MATIC":216309756000000000000,"USDC_m":100000000,"USDT":100000000,"USDT_m":100000000,"PYUSD":100000000,"USDCn_m":100000000},"paymentTotals":{"BTC":180506,"BCH":31036600,"ETH":33503000000000000,"GUSD":10000,"PAX":100000000000000000000,"BUSD":100000000000000000000,"USDC":100000000,"XRP":235806580,"DOGE":96127965500,"LTC":163025800,"MATIC":216309756000000000000,"USDC_m":100000000,"USDT":100000000,"USDT_m":100000000,"PYUSD":100000000,"USDCn_m":100000000},"exchangeRates":{},"amountPaid":180506,"transactionCurrency":"BTC"},"event":{"name":"invoice_completed","code":1006,"timestamp":1720196481452}}',
  validation: {
    header: '+ZCdX1NZOe+EGpKLVIiWhg//S0vsrHYoNjtMAFpVoB8=',
    calculated: '+ZCdX1NZOe+EGpKLVIiWhg//S0vsrHYoNjtMAFpVoB8=',
    validated: true
  }
}
```
