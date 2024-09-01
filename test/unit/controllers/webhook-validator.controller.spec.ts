import chai, { expect } from 'chai';
import Sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Request, Response } from 'express';
import WebhookValidatorController from '../../../src/controllers/webhook-validator.controller';
import { BitPayService, WebhookValidatorService } from '../../../src/services';
import { IBitPayWebhookValidationResponse } from '../../../src/interfaces';

chai.use(sinonChai);

describe('WebhookValidatorController', () => {
  const controller = new WebhookValidatorController();

  afterEach(() => {
    Sinon.restore();
  });

  describe('validate', () => {
    it('should return an Internal Server Error if x-signature header is not specified', async () => {
      const req: Partial<Request> = {
        headers: {},
        body: {}
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'The x-signature header is required.'
      };

      await controller.validate(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if body is empty', async () => {
      const req: Partial<Request> = {
        headers: {
          'x-signature': 'signature'
        },
        body: undefined
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'A non-empty body is required.'
      };

      await controller.validate(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if token is not found', async () => {
      const req: Partial<Request> = {
        headers: {
          'x-signature': 'signature'
        },
        body: {
          id: 'test'
        }
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'Token not found.'
      };

      Sinon.stub(BitPayService, 'getTokenForEvent').resolves(undefined);

      await controller.validate(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error when validation fail', async () => {
      const req: Partial<Request> = {
        headers: {
          'x-signature': 'signature'
        },
        body: {
          id: 'test',
          event: {
            name: 'CREATE'
          }
        }
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'Error'
      };

      Sinon.stub(BitPayService, 'getTokenForEvent').resolves('test');
      Sinon.stub(WebhookValidatorService, 'validateWebhook').throws();

      await controller.validate(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should validate successfully', async () => {
      const req: Partial<Request> = {
        headers: {
          'x-signature': 'signature'
        },
        body: {
          id: 'test',
          event: {
            name: 'CREATE'
          }
        }
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const validationResult = {
        calculated: 'calculatedValue',
        header: 'signature',
        validated: true
      };

      Sinon.stub(BitPayService, 'getTokenForEvent').resolves('test');
      Sinon.stub(WebhookValidatorService, 'validateWebhook').resolves(
        validationResult
      );

      const result: IBitPayWebhookValidationResponse = {
        event: req.body.event?.name,
        token: 'test',
        body: JSON.stringify(req.body),
        validation: validationResult
      };

      await controller.validate(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(result);
    });
  });
});
