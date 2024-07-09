import express from "express";
import BitPayController from "../controllers/bitpay.controller";

const controller = new BitPayController();
const router = express.Router();

// Invoices
router.post("/createInvoice", controller.createInvoice.bind(controller));
router.post(
  "/createAndPayInvoice/",
  controller.createAndPayInvoice.bind(controller),
);
router.post(
  "/resendInvoiceWebhook/:invoiceId",
  controller.resendInvoiceWebhook.bind(controller),
);

// Refunds
router.post(
  "/refundInvoice/:invoiceId",
  controller.createRefund.bind(controller),
);

// Recipients
router.post("/inviteRecipient", controller.inviteRecipient.bind(controller));

// Payouts
router.post("/createPayout", controller.createPayout.bind(controller));

export default router;
