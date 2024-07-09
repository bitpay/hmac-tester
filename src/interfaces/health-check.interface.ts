export interface IHealthCheck {
  healthy: boolean;
  mem: {
    heapTotal: number;
    heapUsed: number;
    rss: number;
  };
}
