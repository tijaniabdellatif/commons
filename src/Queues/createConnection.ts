import { QueueConnection } from './QueueConnection';
import { Logger } from 'winston';

export function createQueueConnection(
  rabbitMqUrl: string,
  logger: Logger
): QueueConnection {
  return new QueueConnection(rabbitMqUrl, logger);
}
