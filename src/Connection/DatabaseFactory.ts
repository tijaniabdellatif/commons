import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from 'winston';
import { createLogger } from '../Services/LoggerService';
import { ServerError } from '../Error/ErrorHandler';

export class DatabaseFactory {
  private static connection: Map<string, DataSource> = new Map();
  private static loggers: Map<string, Logger> = new Map();

  /**
   * Creates and returns a new or existing database connection.
   * @param name Unique database name (per service)
   * @param options TypeORM DataSourceOptions
   * @returns {Promise<DataSource>}
   */
  public static async createConnection(
    name: string,
    options: DataSourceOptions,
    esUrl: string
  ): Promise<DataSource> {
    if (this.connection.has(name)) {
      const exists = this.connection.get(name)!;

      if (!exists.isInitialized) {
        await exists.initialize();
      }

      return exists;
    }

    const logger = createLogger(esUrl, name);
    this.loggers.set(name, logger);

    try {
      const dataSource = new DataSource(options);
      await dataSource.initialize();
      this.connection.set(name, dataSource);
      logger.info(
        `[DatabaseFactory] connection ${name} established (${options.type})`
      );
      return dataSource;
    } catch (error: any) {
      logger.error(
        `[DatabaseFactory] Failed to connect to "${name}": ${error.message}`
      );
      throw error;
    }
  }

  /**
   * Retrieves an existing connection.
   * @param name Unique database name
   * @returns {DataSource}
   */
  public static getConnection(name: string): DataSource {
    if (!this.connection.has(name)) {
      throw new ServerError(
        `[DatabaseFactory] connection ${name} not found`,
        'Database Factory getConnection() method'
      );
    }

    return this.connection.get(name)!;
  }

  /**
   * Closes a specific database connection.
   * @param name Unique database name
   */

  public static async closeConnection(name: string): Promise<void> {
    const connection = this.getConnection(name);
    const logger = this.loggers.get(name);

    if (connection && connection.isInitialized) {
      await connection.destroy();
      this.connection.delete(name);
      logger?.info(`[DatabaseFactory] connection ${name} closed .`);
    }
  }

  public static async closeAll(): Promise<void> {
    for (const [name, connection] of this.connection.entries()) {
      if (connection.isInitialized) {
        await connection.destroy();
        this.loggers
          .get(name)
          ?.info(`[DatabaseFactory] Connection "${name}" closed.`);
      }
    }
    this.connection.clear();
    this.loggers.clear();
  }
}
