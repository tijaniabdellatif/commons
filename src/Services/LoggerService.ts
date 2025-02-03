import winston, { Logger, format, transports } from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

export const createLogger = (
  esUrl: string,
  serviceName: string,
  level: string = 'debug'
): Logger => {
  const esTransport = new ElasticsearchTransport({
    level,
    clientOpts: { node: esUrl },
    indexPrefix: serviceName.toLowerCase(),
  });

  return winston.createLogger({
    level,
    format: format.combine(
      format.timestamp(),
      format.json(),
      format.colorize()
    ),
    transports: [new transports.Console(), esTransport],
  });
};
