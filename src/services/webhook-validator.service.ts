import crypto from 'node:crypto';
import logger from '../logger';
import { IBitPayWebhookValidationResult } from '../interfaces';

class WebhookValidatorServiceImpl {
  /**
   * Validate a webhook by signing the body with the key and comparing the
   * header to the result.
   *
   * @param signingKey Signing key
   * @param body Webhook body
   * @param header Webhook x-signature header
   * @return comparison
   */
  async validateWebhook(
    signingKey: string,
    body: string,
    header: string
  ): Promise<IBitPayWebhookValidationResult | undefined> {
    try {
      const hmac = crypto.createHmac('sha256', signingKey);
      hmac.update(body);
      const calculated = hmac.digest('base64');

      const result: IBitPayWebhookValidationResult = {
        header: header,
        calculated: calculated,
        validated: header === calculated
      };

      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error('Could validate webhook.', {
          code: 'WEBHOOK_VALIDATE_FAIL',
          context: {
            error: err.message
          }
        });
      }
    }

    return undefined;
  }
}

export const WebhookValidatorService = new WebhookValidatorServiceImpl();
