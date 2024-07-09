import { IHealthCheck } from "../interfaces";

class StatusServiceImpl {
  /**
   * Simple health check
   *
   * @return {res} The health check response
   */
  async getHealth(): Promise<IHealthCheck> {
    const mem = process.memoryUsage();
    const res = {
      healthy: true,
      mem: {
        heapTotal: mem.heapTotal,
        heapUsed: mem.heapUsed,
        rss: mem.rss,
      },
    };

    return res;
  }
}

export const StatusService = new StatusServiceImpl();
