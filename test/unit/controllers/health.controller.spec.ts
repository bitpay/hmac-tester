import Sinon from 'sinon';
import { StatusService } from '../../../src/services';
import { IHealthCheck } from '../../../src/interfaces';
import HealthController from '../../../src/controllers/health.controller';
import { Request, Response } from 'express';
import { expect } from 'chai';

describe('HealthController', () => {
  const controller = new HealthController();

  describe('health', () => {
    it('should check healthy', async () => {
      const res: Partial<Response> = {};
      const req = {} as Partial<Request>;
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data: IHealthCheck = {
        healthy: true,
        mem: {
          heapTotal: 0,
          heapUsed: 0,
          rss: 0
        }
      };

      Sinon.stub(StatusService, 'getHealth').resolves(data);

      await controller.health(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });
});
