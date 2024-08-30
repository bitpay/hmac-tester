import express from 'express';
import bitpayRoutes from './bitpay.routes';
import healthRoutes from './health.routes';
import webhookValidatorRoutes from './webhook-validator.routes';

const router = express.Router();

router.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200).end();
});

router.use('/bitpay', bitpayRoutes);
router.use('/health', healthRoutes);
router.use('/webhook-validator', webhookValidatorRoutes);

export default router;
