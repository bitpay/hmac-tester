import express from "express";
import WebhookValidatorController from "../controllers/webhook-validator.controller";

const controller = new WebhookValidatorController();
const router = express.Router();

router.post("/", controller.validate.bind(controller));

export default router;
