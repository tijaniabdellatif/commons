import { DataSource, DataSourceOptions } from 'typeorm';

export class DatabaseFactory {
  private static connection: Map<string, DataSource> = new Map();

  public static async createConnection(
    name: string,
    options: DataSourceOptions
  ): Promise<DataSource> {
    if (this.connection.has(name)) {
      return this.connection.get(name)!;
    }

    const dataSource = new DataSource(options);
    await dataSource.initialize();

    this.connection.set(name, dataSource);
    console.log(`Connection ${name} created, type: ${options.type}`);
    return dataSource;
  }

  public static getConnection(name: string): DataSource {
    if (!this.connection.has(name)) {
      throw new Error(`Connection ${name} not found.`);
    }
    return this.connection.get(name)!;
  }
}
