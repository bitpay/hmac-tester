import { Request, Response } from 'express';
import { StatusService } from '../services';
import { IHealthCheck } from '../interfaces';

export default class HealthController {
  /**
   * Simple health check
   *
   * @param _req Request
   * @param res Response
   */
  async health(_req: Request, res: Response): Promise<void> {
    const result: IHealthCheck = await StatusService.getHealth();

    res.json(result);
  }
}
