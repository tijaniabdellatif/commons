import { ElasticSearchConfig } from './ElasticInterface';
import { ElasticSearch } from './ElasticSearch';

export class ElasticSearchFactory {
  public static create(config: ElasticSearchConfig): ElasticSearch {
    return new ElasticSearch(config);
  }
}
