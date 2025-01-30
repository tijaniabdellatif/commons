import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { ElasticSearchConfig } from './ElasticInterface';
import { winstonLogger } from '../Interfaces/logger';

export class ElasticSearch {
  private log: Logger;
  private elasticClient: Client;
  private config: ElasticSearchConfig;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: ElasticSearchConfig) {
    this.config = config;
    this.maxRetries = config.maxRetries || 5;
    this.retryDelay = config.retryDelay || 1000;

    this.elasticClient = new Client({
      node: this.config.node,
    });

    this.log = winstonLogger(
      this.config.node,
      this.config.serviceName,
      'debug'
    );
  }

  public async checkConnection(): Promise<void> {
    for (let retryCount = 0; retryCount < this.maxRetries; retryCount++) {
      this.log.info(`${this.config.serviceName} connecting to ElasticSearch. Attempt ${retryCount + 1}`);
  
      try {
        const health = await this.elasticClient.cluster.health({});
        this.log.info(`${this.config.serviceName} Elastic Search health status - ${health.status} ${health.cluster_name}`);
        return; // Connection successful, exit the method
      } catch (error) {
        this.log.error(`Connection to Elasticsearch failed. Retrying in ${this.retryDelay}ms...`);
  
        if (retryCount < this.maxRetries - 1) {
          await this.sleep(this.retryDelay);
          this.retryDelay *= 2;
        } else {
          this.log.error('Max retries reached. Giving up.');
          throw new Error('Failed to connect to Elasticsearch after maximum retries.');
        }
      }
    }
  }

  public getClient(): Client {
    return this.elasticClient;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
