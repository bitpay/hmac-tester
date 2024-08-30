import { expect } from 'chai';
import Sinon from 'sinon';
import { StatusService } from '../../../src/services';
import { IHealthCheck } from '../../../src/interfaces';

describe('StatusService', () => {
  it('should return memory usage data', async () => {
    const mem = {
      heapTotal: 1,
      heapUsed: 1,
      rss: 1,
      external: 1,
      arrayBuffers: 1
    };
    const data: IHealthCheck = {
      healthy: true,
      mem: {
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        rss: mem.rss
      }
    };

    Sinon.stub(process, 'memoryUsage').returns(mem);
    expect(await StatusService.getHealth()).to.eql(data);
  });
});
