import chai, { expect } from 'chai';
import Sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { BitPayService } from '../../../src/services';
import {
  Invoice,
  InvoiceInterface,
  PayoutInterface,
  PayoutRecipientInterface
} from 'bitpay-sdk/dist/Model';
import { Refund } from 'bitpay-sdk/dist/Model/Invoice/Refund';

chai.use(sinonChai);

describe('BitpayService', () => {
  afterEach(() => {
    Sinon.restore();
  });

  describe('getTokens', () => {
    it('should return tokens', async () => {
      expect(await BitPayService.getTokens()).to.eql({
        merchant: 'test',
        payout: 'test'
      });
    });
  });

  describe('getTokenForEvent', () => {
    it('should return token', async () => {
      expect(await BitPayService.getTokenForEvent('invoice_confirmed')).to.eql(
        'test'
      );
    });

    it('should return undefined when event name does not exist in event table', async () => {
      expect(
        await BitPayService.getTokenForEvent('event_does_not_exist')
      ).to.eql(undefined);
    });
  });

  describe('createInvoice', () => {
    it('should return invoice', async () => {
      const data: Partial<Invoice> = {
        currency: 'USD',
        guid: '',
        token: '',
        price: 50
      };

      Sinon.stub(BitPayService.client, 'createInvoice').resolves(
        data as Invoice
      );
      expect(await BitPayService.createInvoice('http://test.com')).to.eql(data);
    });

    it('should return undefined when fail while create invoice', async () => {
      Sinon.stub(BitPayService.client, 'createInvoice').throws();
      expect(await BitPayService.createInvoice('http://test.com')).to.eql(
        undefined
      );
    });
  });

  describe('payInvoice', () => {
    it('should pay invoice', async () => {
      const data: Partial<InvoiceInterface> = {
        currency: 'USD',
        guid: '',
        token: ''
      };

      Sinon.stub(BitPayService.client, 'payInvoice').resolves(
        data as InvoiceInterface
      );

      expect(await BitPayService.payInvoice('someId')).to.equal(undefined);
    });
  });

  describe('resendInvoiceWebhook', () => {
    it('should return true', async () => {
      Sinon.stub(
        BitPayService.client,
        'requestInvoiceWebhookToBeResent'
      ).resolves(true);
      expect(await BitPayService.resendInvoiceWebhook('someId')).to.eql(true);
    });

    it('should return false', async () => {
      Sinon.stub(
        BitPayService.client,
        'requestInvoiceWebhookToBeResent'
      ).resolves(false);
      expect(await BitPayService.resendInvoiceWebhook('someId')).to.eql(false);
    });
  });

  describe('createRefund', () => {
    it('should return creeted refund', async () => {
      const data: Refund = {
        amount: 20,
        currency: 'USD',
        id: 'someID',
        requestDate: '',
        status: '',
        invoice: '',
        transactionCurrency: '',
        transactionAmount: 0,
        transactionRefundFee: 0,
        refundFee: 20,
        immediate: false,
        buyerPaysRefundFee: false
      };

      Sinon.stub(BitPayService.client, 'createRefund').resolves(data);

      expect(
        await BitPayService.createRefund('someId', 20, 'http://test.com')
      ).to.eql(data);
    });
  });

  describe('createPayout', () => {
    it('should return created payout', async () => {
      const data: PayoutInterface = {
        amount: 20,
        currency: 'USD',
        ledgerCurrency: ''
      };

      Sinon.stub(BitPayService.client, 'submitPayout').resolves(data);

      expect(
        await BitPayService.createPayout('http://test.com', 'someId')
      ).to.eql(data);
    });
  });

  describe('inviteRecipient', () => {
    it('should return payout recipients', async () => {
      const data: PayoutRecipientInterface[] = [
        {
          email: 'test@test.com'
        }
      ];

      Sinon.stub(BitPayService.client, 'submitPayoutRecipients').resolves(data);
      expect(
        await BitPayService.inviteRecipient('test@test.com', 'http://test.com')
      ).to.eql(data);
    });
  });
});
