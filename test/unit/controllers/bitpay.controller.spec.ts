import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import BitPayController from '../../../src/controllers/bitpay.controller';
import Sinon from 'sinon';
import { Request, Response } from 'express';
import { BitPayService } from '../../../src/services';
import {
  Invoice,
  PayoutInterface,
  PayoutRecipientInterface
} from 'bitpay-sdk/dist/Model';
import { Refund } from 'bitpay-sdk/dist/Model/Invoice/Refund';

chai.use(sinonChai);

describe('BitpayController', () => {
  const controller = new BitPayController();
  let req = {
    app: {
      ngrokListenerUrl: 'asda',
      get: (x: string) => x
    }
  } as unknown as Partial<Request>;

  afterEach(() => {
    Sinon.restore();
  });

  describe('createInvoice', () => {
    it('should create invoice', async () => {
      const data: Partial<Invoice> = {
        currency: 'USD',
        guid: '',
        token: ''
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);

      Sinon.stub(BitPayService, 'createInvoice').resolves(data as Invoice);

      await controller.createInvoice(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error when no invoice', async () => {
      const res: Partial<Response> = {};
      const data = {
        success: false
      };
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);
      Sinon.stub(BitPayService, 'createInvoice').resolves(undefined);
      await controller.createInvoice(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error when fail', async () => {
      const res: Partial<Response> = {};
      const data = {
        success: false,
        error: 'Error'
      };
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);
      Sinon.stub(BitPayService, 'createInvoice').throws();
      await controller.createInvoice(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });

  describe('resendInvoiceWebhook', () => {
    it('should return an Internal Server Error if no invoice ID parameter is specified', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'Parameter invoiceId is required.'
      };

      await controller.resendInvoiceWebhook(
        { params: {} } as Request,
        res as Response
      );
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if the webhook resend fails', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const req = {
        params: {
          invoiceId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      } as unknown as Partial<Request>;

      const data = {
        success: false
      };

      Sinon.stub(BitPayService, 'resendInvoiceWebhook').resolves(false);

      await controller.resendInvoiceWebhook(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if fails', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const req = {
        params: {
          invoiceId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      } as unknown as Partial<Request>;

      const data = {
        success: false,
        error: 'Error'
      };

      Sinon.stub(BitPayService, 'resendInvoiceWebhook').throws();

      await controller.resendInvoiceWebhook(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should resend webhook', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const req = {
        params: {
          invoiceId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      } as unknown as Partial<Request>;

      const data = {
        success: true
      };

      Sinon.stub(BitPayService, 'resendInvoiceWebhook').resolves(true);

      await controller.resendInvoiceWebhook(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });

  describe('createAndPayInvoice', () => {
    it('should create and pay invoice', async () => {
      const data: Partial<Invoice> = {
        currency: 'USD',
        guid: '',
        token: ''
      };
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      Sinon.stub(BitPayService, 'createInvoice').resolves(data as Invoice);
      Sinon.stub(BitPayService, 'payInvoice').resolves();

      await controller.createAndPayInvoice(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error when no invoice', async () => {
      const res: Partial<Response> = {};
      const data = {
        success: false
      };
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);
      Sinon.stub(BitPayService, 'createInvoice').resolves(undefined);
      await controller.createAndPayInvoice(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error when fail', async () => {
      const res: Partial<Response> = {};
      const invoiceData: Partial<Invoice> = {
        currency: 'USD',
        guid: '',
        token: '',
        id: 'a12313'
      };
      const data = {
        success: false,
        error: 'Error'
      };
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);
      Sinon.stub(BitPayService, 'createInvoice').resolves(
        invoiceData as Invoice
      );
      Sinon.stub(BitPayService, 'payInvoice').throws();
      await controller.createAndPayInvoice(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });

  describe('createRefund', () => {
    it('should create refund', async () => {
      const res: Partial<Response> = {};
      req = {
        ...req,
        params: {
          invoiceId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      };
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);
      const data: Refund = {
        amount: 0,
        currency: '',
        id: '',
        requestDate: '',
        status: '',
        invoice: '',
        transactionCurrency: '',
        transactionAmount: 0,
        transactionRefundFee: 0,
        refundFee: 0,
        immediate: false,
        buyerPaysRefundFee: false
      };

      Sinon.stub(BitPayService, 'createRefund').resolves(data);

      await controller.createRefund(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if no invoice ID parameter is specified', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'Parameter invoiceId is required.'
      };

      await controller.createRefund({ params: {} } as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if no refund', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      req = {
        ...req,
        params: {
          invoiceId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      } as unknown as Partial<Request>;

      const data = {
        success: false
      };

      Sinon.stub(BitPayService, 'createRefund').resolves(undefined);

      await controller.createRefund(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if fails', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      req = {
        ...req,
        params: {
          invoiceId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      } as unknown as Partial<Request>;

      const data = {
        success: false,
        error: 'Error'
      };

      Sinon.stub(BitPayService, 'createRefund').throws();

      await controller.createRefund(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });

  describe('createPayout', () => {
    it('should create payout', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data: PayoutInterface = {
        amount: 0,
        currency: '',
        ledgerCurrency: ''
      };

      req = {
        ...req,
        body: {
          recipientId: 'PAs73k7FvGaDnLjBH6MVzh'
        }
      } as unknown as Partial<Request>;

      Sinon.stub(BitPayService, 'createPayout').resolves(data);

      await controller.createPayout(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if no recipientId parameter is specified', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'Parameter recipientId is required.'
      };

      req = {
        ...req,
        body: {}
      };

      Sinon.stub(BitPayService, 'createPayout').resolves(undefined);

      await controller.createPayout(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should return an Internal Server Error if fails', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      const data = {
        success: false,
        error: 'Error'
      };

      req = {
        ...req,
        body: {}
      };

      Sinon.stub(BitPayService, 'createPayout').throws();

      await controller.createPayout(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });

  describe('inviteRecipient', () => {
    it('should invite recipient', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      req = {
        ...req,
        body: {
          email: 'test@test.com'
        }
      };

      const data: PayoutRecipientInterface[] = [
        {
          email: 'test@test.com'
        }
      ];

      Sinon.stub(BitPayService, 'inviteRecipient').resolves(data);

      await controller.inviteRecipient(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should throw an Internal Server Error if no body provided', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      req = {
        ...req,
        body: {}
      };

      const data = {
        success: false,
        error: 'The body field is required.'
      };

      Sinon.stub(BitPayService, 'inviteRecipient').resolves(undefined);

      await controller.inviteRecipient(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });

    it('should throw an Internal Server Error if fails', async () => {
      const res: Partial<Response> = {};
      res.json = Sinon.stub().returns(res);
      res.status = Sinon.stub().returns(res);

      req = {
        ...req,
        body: {}
      };

      const data = {
        success: false,
        error: 'Error'
      };

      Sinon.stub(BitPayService, 'inviteRecipient').throws();

      await controller.inviteRecipient(req as Request, res as Response);
      expect(res.json).to.have.been.calledWith(data);
    });
  });
});
