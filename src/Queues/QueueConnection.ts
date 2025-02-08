import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';

export class QueueConnection {
  private channel: Channel | undefined;
  private connection: Connection | undefined;
  private readonly logger: Logger;

  constructor(private rabbitMqUrl: string, logger: Logger) {
    this.logger = logger;
    this.setupCloseHandlers();
  }

  public async createConnection(): Promise<Channel | undefined> {
    try {
      this.connection = await client.connect(this.rabbitMqUrl);
      this.channel = await this.connection.createChannel();
      this.logger.info(`Connected to RabbitMQ at  ${this.rabbitMqUrl}`);
    } catch (error) {
      this.logger.error('Error in createConnection()', error);
      return undefined;
    }
  }

  private setupCloseHandlers(): void {
    if (process.listenerCount('SIGINT') === 0) {
      process.once('SIGINT', async () => await this.closeConnection());
    }

    if (process.listenerCount('SIGTERM') === 0) {
      process.once('SIGTERM', async () => await this.closeConnection());
    }
  }

  public async closeConnection(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    this.logger.info('RabbitMQ connection closed');
  }

  public getChannel(): Channel | undefined {
    return this.channel;
  }

  public getConnection(): Connection | undefined {
    return this.connection;
  }
}
