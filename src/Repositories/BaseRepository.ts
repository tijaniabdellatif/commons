import {
  Repository,
  EntityManager,
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Like,
  FindOptionsOrder,
} from 'typeorm';
import { EventEmitter } from 'events';
import { validateOrReject } from 'class-validator';
import {
  IError,
  ServerError,
  ValidationProccessError,
} from '../Error/ErrorHandler';
export class BaseRepository<T extends Object> {
  private eventEmitter: EventEmitter;
  constructor(
    private repository: Repository<T>,
    private manager: EntityManager
  ) {
    this.eventEmitter = new EventEmitter();
  }

  private emitEvent(event: string, data: T) {
    this.eventEmitter.emit(event, data);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async findById(id: number): Promise<T | null> {
    return await this.repository.findOne({ where: { id } as any });
  }

  private async validateDTO<D extends object>(
    data: Partial<T>,
    DTOClass: new () => D
  ): Promise<void> {
    const dtoInstance = Object.assign(new DTOClass(), data);
    try {
      await validateOrReject(dtoInstance);
    } catch (error: any) {
      throw new ValidationProccessError(
        'Validation failed',
        'Validation Instance'
      );
    }
  }

  async create<D extends object>(
    data: Partial<T>,
    DTOClass?: new () => D
  ): Promise<T | T[]> {
    if (DTOClass) {
      await this.validateDTO(data, DTOClass);
    }
    const entity = this.repository.create(data as DeepPartial<T>);
    const saved = await this.repository.save(entity);

    this.emitEvent(`${this.repository.metadata.name}.created`, saved);
    return saved;
  }

  async save(entity: T): Promise<T> {
    const saved = await this.repository.save(entity);
    this.emitEvent(`${this.repository.metadata.name}.updated`, saved);
    return saved;
  }

  async Softdelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
    this.emitEvent(`${this.repository.metadata.name}.softDeleted`, {
      id,
    } as any);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
    this.emitEvent(`${this.repository.metadata.name}.deleted`, { id } as any);
  }

  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    filters?: FindOptionsWhere<T>,
    searchField?: keyof T,
    searchQuery?: string,
    sortField?: keyof T,
    sortOrder: 'ASC' | 'DESC' = 'ASC'
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const whereClause = filters || {};
    if (searchField && searchQuery) {
      (whereClause as any)[searchField] = Like(`%${searchQuery}%`);
    }

    const options: FindManyOptions<T> = {
      where: filters || {},
      skip: (page - 1) * limit,
      take: limit,
      order: sortField
        ? ({ [sortField]: sortOrder } as FindOptionsOrder<T>)
        : undefined,
    };

    const [data, total] = await this.repository.findAndCount(options);
    return {
      data,
      total,
      page,
      limit,
    };
  }

  async transaction(
    runInTransaction: (manager: EntityManager) => Promise<any>
  ): Promise<void> {
    await this.manager.transaction(async (transactionManager) => {
      try {
        await runInTransaction(transactionManager);
      } catch (error: any | IError) {
        throw new ServerError(
          `Transaction failed ${error.message}`,
          `transaction method ()`
        );
      }
    });
  }

  on(event: string, listner: (data: any) => void) {
    this.eventEmitter.on(event, listner);
  }

  protected getRepository(): Repository<T> {
    return this.repository;
  }
}
