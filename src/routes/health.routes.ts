import express from "express";
import HealthController from "../controllers/health.controller";

const controller = new HealthController();
const router = express.Router();

// Health check
router.get("/", controller.health.bind(controller));

export default router;
