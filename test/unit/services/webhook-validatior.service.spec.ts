import chai, { expect } from 'chai';
import Sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { WebhookValidatorService } from '../../../src/services';

chai.use(sinonChai);

describe('WebhookValidatorService', () => {
  afterEach(() => {
    Sinon.restore();
  });

  it('should return successful validation object', async () => {
    expect(
      await WebhookValidatorService.validateWebhook(
        'test',
        JSON.stringify({ id: 'test' }),
        '0KkGd2YCcbkhX15N8QF1moe/E6SG+EjHf6B8BE1uzr0='
      )
    ).to.eql({
      calculated: '0KkGd2YCcbkhX15N8QF1moe/E6SG+EjHf6B8BE1uzr0=',
      header: '0KkGd2YCcbkhX15N8QF1moe/E6SG+EjHf6B8BE1uzr0=',
      validated: true
    });
  });

  it('should return fail validation object', async () => {
    expect(
      await WebhookValidatorService.validateWebhook(
        'test',
        JSON.stringify({ id: 'test' }),
        '0KkGd2YCcbkhX15N8QF1moe/E6SG+EjHf6B8BE1uzr0=XXX'
      )
    ).to.eql({
      calculated: '0KkGd2YCcbkhX15N8QF1moe/E6SG+EjHf6B8BE1uzr0=',
      header: '0KkGd2YCcbkhX15N8QF1moe/E6SG+EjHf6B8BE1uzr0=XXX',
      validated: false
    });
  });
});
