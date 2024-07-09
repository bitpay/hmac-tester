import { Request, Response } from "express";
import { BitPayService } from "../services";

export default class BitPayController {
  /**
   * Create an invoice
   *
   * @param _req
   * @param res
   */
  async createInvoice(_req: Request, res: Response): Promise<void> {
    const notificationURL = _req.app.get("ngrokListenerUrl");
    try {
      const invoice = await BitPayService.createInvoice(notificationURL);

      if (invoice) {
        res.json(invoice);
        return;
      }

      res.status(500).json({ success: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    }
  }

  /**
   * Request an invoice webhook be resent
   *
   * @param _req
   * @param res
   */
  async resendInvoiceWebhook(_req: Request, res: Response): Promise<void> {
    if (!_req.params.invoiceId) {
      res.status(500).json({
        success: false,
        error: 'Parameter invoiceId is required.',
      });
    }

    try {
      if (_req.params.invoiceId) {
        const status = await BitPayService.resendInvoiceWebhook(
          _req.params.invoiceId,
        );

        if (status) {
          res.json({ success: true });
          return;
        }
      }

      res.status(500).json({ success: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    }
  }

  /**
   * Create and pay an invoice
   *
   * @param _req
   * @param res
   */
  async createAndPayInvoice(_req: Request, res: Response): Promise<void> {
    const notificationURL = _req.app.get("ngrokListenerUrl");

    try {
      const invoice = await BitPayService.createInvoice(notificationURL);

      if (invoice?.id) {
        const invoiceId = invoice.id;
        await BitPayService.payInvoice(invoiceId);
      }

      if (invoice) {
        res.json(invoice);
        return;
      }

      res.status(500).json({ success: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    }
  }

  /**
   * Create a refund
   *
   * @param _req
   * @param res
   */
  async createRefund(_req: Request, res: Response): Promise<void> {
    if (!_req.params.invoiceId) {
      res.status(500).json({
        success: false,
        error: 'Parameter invoiceId is required.',
      });
    }

    try {
      const notificationURL = _req.app.get("ngrokListenerUrl");
      if (_req.params.invoiceId) {
        const refund = await BitPayService.createRefund(
          _req.params.invoiceId,
          100.0,
          notificationURL,
        );

        if (refund) {
          res.json(refund);
          return;
        }

        res.status(500).json({ success: false });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    }
  }

  /**
   * Create a payout
   *
   * @param _req
   * @param res
   */
  async createPayout(_req: Request, res: Response): Promise<void> {
    const notificationURL = _req.app.get("ngrokListenerUrl");

    try {
      const invoice = await BitPayService.createPayout(notificationURL);

      if (invoice) {
        res.json(invoice);
        return;
      }

      res.status(500).json({ success: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    }
  }

  async inviteRecipient(_req: Request, res: Response): Promise<void> {
    const notificationURL = _req.app.get("ngrokListenerUrl");

    if (!_req.body.email) {
      throw new Error("The body field is required.");
    }

    try {
      const recipient = await BitPayService.inviteRecipient(
        _req.body.email,
        notificationURL,
      );

      if (recipient) {
        res.json(recipient);
        return;
      }

      res.status(500).json({ success: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    }
  }
}
