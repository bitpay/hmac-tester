import express from 'express';
import expressWinston from 'express-winston';
import ngrok from '@ngrok/ngrok';
import winston from 'winston';
import configuration from './configuration';
import logger from './logger';
import routes from './routes';

const app: express.Application = express();

app.use(express.json());

app.use('/', routes);

app.use(
  expressWinston.logger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
  })
);

app.use(
  expressWinston.errorLogger({
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
  })
);

/**
 * Configure Ngrok
 */
async function standardConfig() {
  ngrok.loggingCallback(function (level, target, message) {
    logger.log(level.toLowerCase(), message, {
      code: 'NGROK_CALLBACK',
      target: target
    });
  });
  const sessionBuilder = new ngrok.SessionBuilder()
    .authtokenFromEnv()
    .handleStopCommand(() => {
      logger.info('Ngrok stopped', {
        code: 'NGROK_STOP'
      });
    })
    .handleRestartCommand(() => {
      logger.info('Ngrok restart', {
        code: 'NGROK_RESTART'
      });
    })
    .handleUpdateCommand((update) => {
      logger.info('Ngrok updated', {
        code: 'NGROK_update',
        context: {
          version: update.version,
          permitMajorVersion: update.permitMajorVersion
        }
      });
    });
  const session = await sessionBuilder.connect();
  const listener = await session
    .httpEndpoint()
    .domain(configuration.ngrok.domain)
    .listen();
  logger.info(`Ingress established at: ${listener.url()}`, {
    code: 'INGRESS_ESTABLISH_SUCCESS'
  });
  app.set('ngrokListenerUrl', `${listener.url()}/webhook-validator`);
  listener.forward(`localhost:${configuration.express.port}`);
  ngrok.loggingCallback();
}

/**
 * Start Express
 */
app.listen(configuration.express.port, async () => {
  logger.info(`Express server listening on ${configuration.express.port}.`, {
    code: 'EXPRESS_START_SUCCESS'
  });

  await standardConfig();
});
