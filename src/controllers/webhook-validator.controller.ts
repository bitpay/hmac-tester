import { Request, Response } from 'express';
import logger from '../logger';
import { BitPayService } from '../services';
import { IBitPayWebhookValidationResponse } from '../interfaces';
import { WebhookValidatorService } from '../services';

export default class WebhookValidatorController {
  /**
   * Process an inbound webhook
   *
   * @param req Webhook request
   * @param res Result of the webhook validation
   */
  async validate(req: Request, res: Response): Promise<void | undefined> {
    const body = JSON.stringify(req.body);
    let xSignature: string = '';

    if (!req.headers['x-signature']) {
      res.status(500).json({
        success: false,
        error: 'The x-signature header is required.'
      });
      return;
    }

    if (!body) {
      res.status(500).json({
        success: false,
        error: 'A non-empty body is required.'
      });
      return;
    }

    if (req.headers['x-signature']) {
      xSignature = req.headers['x-signature'].toString();
    }

    const token = await BitPayService.getTokenForEvent(req.body.event?.name);

    if (!token) {
      res.status(500).json({
        success: false,
        error: 'Token not found.'
      });
      return;
    }

    try {
      const validation = await WebhookValidatorService.validateWebhook(
        token,
        body,
        xSignature
      );

      const result: IBitPayWebhookValidationResponse = {
        event: req.body.event?.name,
        token: token,
        body: body,
        validation: validation
      };

      logger.info('Webhook validation completed.', {
        code: 'WEBHOOK_VALIDATION_COMPLETE',
        context: result
      });

      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message
        });
      }
    }
  }
}
