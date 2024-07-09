import winston from "winston";

export class ApplicationLogger {
  protected logger: winston.Logger;

  /**
   * Constructor
   */
  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }

  /**
   * Log a message
   *
   * @param level   Log level
   * @param message Log message
   * @param context Log metadata
   */
  public log(level: string, message: string, context?: object): void {
    this.logger.log(level, message, {
      timestamp: Date.now(),
      ...context,
    });
  }

  /**
   * Log a debug message
   *
   * @param message Log message
   * @param context Log metadata
   */
  public debug(message: string, context?: object): void {
    this.log("debug", message, context);
  }

  /**
   * Log an informational message
   *
   * @param message Log message
   * @param context Log metadata
   */
  public info(message: string, context?: object): void {
    this.log("info", message, context);
  }

  /**
   * Log a warning message
   *
   * @param message Log message
   * @param context Log metadata
   */
  public warning(message: string, context?: object): void {
    this.log("warning", message, context);
  }

  /**
   * Log an error message
   *
   * @param message Log message
   * @param context Log metadata
   */
  public error(message: string, context?: object): void {
    this.log("error", message, context);
  }
}

const logger = new ApplicationLogger();

export default logger;
