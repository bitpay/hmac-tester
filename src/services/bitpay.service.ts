import configuration from "../configuration";
import logger from "../logger";
import { IBitPayTokens } from "../interfaces";
import { Client, Currency, Facade } from "bitpay-sdk";
import {
  Payout,
  PayoutInterface,
  PayoutRecipient,
  PayoutRecipientInterface,
  PayoutRecipients,
} from "bitpay-sdk/dist/Model";
import { Buyer } from "bitpay-sdk/dist/Model/Invoice/Buyer";
import { Invoice } from "bitpay-sdk/dist/Model/Invoice/Invoice";
import { Refund } from "bitpay-sdk/dist/Model/Invoice/Refund";
import BitPayApiException from "bitpay-sdk/dist/Exceptions/BitPayApiException";

class BitPayServiceImpl {
  client: Client;

  /**
   * Constructor
   *
   * Creates a BitPay client using the configuration file when the class
   * is instantiated.
   */
  constructor() {
    this.client = Client.createClientByConfig(configuration.bitpay.configFile);
  }

  /**
   * Get the merchant and payout tokens
   *
   * @returns Token structure containing merchant and payout tokens
   */
  public async getTokens(): Promise<IBitPayTokens> {
    const tokens = {
      merchant: this.client.getToken(Facade.Merchant),
      payout: this.client.getToken(Facade.Payout),
    };

    return tokens;
  }

  /**
   * Lookup table for event <> token
   *
   * @param eventName Name of the BitPay Event
   * @returns
   */
  public async getTokenForEvent(eventName: string): Promise<string | undefined> {
    const tokens = await this.getTokens();

    const eventsTable: Record<string, string> = {
      invoice_paidInFull: tokens.merchant,
      invoice_expired: tokens.merchant,
      invoice_confirmed: tokens.merchant,
      invoice_completed: tokens.merchant,
      invoice_manuallyNotified: tokens.merchant,
      invoice_failedToConfirm: tokens.merchant,
      invoice_refundComplete: tokens.merchant,
      invoice_declined: tokens.merchant,
      refund_created: tokens.merchant,
      refund_pending: tokens.merchant,
      refund_success: tokens.merchant,
      refund_failure: tokens.merchant,
      recipient_invited: tokens.payout,
      recipient_unverified: tokens.payout,
      recipient_verified: tokens.payout,
      recipient_active: tokens.payout,
      recipient_paused: tokens.payout,
      recipient_removed: tokens.payout,
      recipient_manuallyNotified: tokens.payout,
      payout_funded: tokens.payout,
      payout_processing: tokens.payout,
      payout_completed: tokens.payout,
      payout_cancelled: tokens.payout,
      payout_manuallyNotified: tokens.payout,
    };

    const token = eventsTable[eventName];

    return token ? token : undefined;
  }

  /**
   * Create an invoice
   *
   * @param notificationURL Notification URL for webhooks
   * @returns
   */
  public async createInvoice(
    notificationURL: string,
  ): Promise<Invoice | undefined> {
    const invoice: Invoice = new Invoice(100.0, "USD");
    invoice.notificationEmail = "rbrodie@itx.com";
    invoice.notificationURL = notificationURL;

    const buyer: Buyer = new Buyer();
    buyer.name = "Test";
    buyer.email = "rbrodie85@gmail.com";
    buyer.address1 = "168 General Grove";
    buyer.country = "AD";
    buyer.locality = "Port Horizon";
    buyer.notify = true;
    buyer.phone = "+990123456789";
    buyer.postalCode = "KY7 1TH";
    buyer.region = "New Port";

    invoice.buyer = buyer;

    try {
      const createdInvoice: Invoice = await this.client.createInvoice(invoice);
      return createdInvoice;
    } catch (err: unknown) {
      if (err instanceof BitPayApiException) {
        logger.error("Could not create invoice.", {
          code: "INVOICE_CREATE_FAIL",
          context: {
            error: err.message,
          },
        });
      }
    }
    
    return undefined;
  }

  /**
   * Pay an invoice
   *
   * @param invoiceId Invoice ID
   */
  public async payInvoice(invoiceId: string): Promise<void> {
    try {
      await this.client.payInvoice(invoiceId, "complete");
    } catch (err: unknown) {
      if (err instanceof BitPayApiException) {
        logger.error("Could not pay invoice.", {
          code: "INVOICE_PAY_FAIL",
          context: {
            error: err.message,
          },
        });
      }
    }
  }

  /**
   * Request an invoice webhook to be resent
   *
   * TODO: This is throwing an error that the endpoint is not available for the
   * merchant facade.
   *
   * @param invoiceId Invoice ID
   */
  public async resendInvoiceWebhook(
    invoiceId: string,
  ): Promise<boolean> {
    try {
      const invoiceWebhookResend =
        await this.client.requestInvoiceWebhookToBeResent(invoiceId);
      return invoiceWebhookResend;
    } catch (err: unknown) {
      if (err instanceof BitPayApiException) {
        logger.error("Could not request invoice webhook to be resent.", {
          code: "INVOICE_REQUEST_WEBHOOK_FAIL",
          context: {
            error: err.message,
          },
        });
      }
    }

    return false;
  }

  /**
   * Create a refund
   *
   * @param invoiceId       Invoice ID
   * @param amount          Amount to refund
   * @param notificationURL Notification URL for webhooks
   */
  public async createRefund(
    invoiceId: string,
    amount: number,
    notificationURL: string,
  ): Promise<Refund | undefined> {
    console.log(notificationURL);
    const token: string = (await this.getTokens()).merchant;
    const refund: Refund = new Refund(amount, invoiceId, token);
    refund.notificationURL = notificationURL;

    try {
      const createdRefund: Refund = await this.client.createRefund(refund);
      return createdRefund;
    } catch (err: unknown) {
      if (err instanceof BitPayApiException) {
        logger.error("Could not create refund.", {
          code: "REFUND_CREATE_FAIL",
          context: {
            error: err.message,
          },
        });
      }
    }

    return undefined;
  }

  /**
   * Create a payout
   *
   * @param notificationURL Notification URL for webhooks
   */
  public async createPayout(
    notificationURL: string,
    recipientId: string
  ): Promise<PayoutInterface | undefined> {
    const payout = new Payout(10.0, Currency.USD, Currency.USD);
    payout.notificationURL = notificationURL;
    payout.recipientId = recipientId;

    try {
      const createdPayout: PayoutInterface =
        await this.client.submitPayout(payout);
      return createdPayout;
    } catch (err: unknown) {
      if (err instanceof BitPayApiException) {
        logger.error("Could not create payout.", {
          code: "PAYOUT_CREATE_FAIL",
          context: {
            error: err.message,
          },
        });
      }
    }

    return undefined;
  }

  /**
   * Invite a payout recipient
   * @param email           Recipient's email address
   * @param notificationURL Notification URL for webhooks
   * @returns
   */
  public async inviteRecipient(
    email: string,
    notificationURL: string,
  ): Promise<PayoutRecipientInterface[] | undefined> {
    const payoutRecipient = new PayoutRecipient(email, null, notificationURL);
    const payoutRecipients = new PayoutRecipients([payoutRecipient]);

    try {
      const recipients =
        await this.client.submitPayoutRecipients(payoutRecipients);
      return recipients;
    } catch (err: unknown) {
      if (err instanceof BitPayApiException) {
        logger.error("Could not invite recipient.", {
          code: "RECIPIENT_INVITE_FAIL",
          context: {
            error: err.message,
          },
        });
      }
    }

    return undefined;
  }
}

export const BitPayService = new BitPayServiceImpl();
