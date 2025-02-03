import {
  Repository,
  EntityManager,
  DeepPartial,
  FindManyOptions,
} from 'typeorm';
import { validateOrReject } from 'class-validator';
import { ErrorHandler, IError, ServerError, ValidationProccessError } from '../Error/ErrorHandler';
export class BaseRepository<T extends Object> {
  constructor(
    private repository: Repository<T>,
    private manager: EntityManager
  ) {}

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
    return await this.repository.save(entity);
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async Softdelete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async transaction(
    runInTransaction: (manager: EntityManager) => Promise<any>
  ): Promise<void> {
    await this.manager.transaction(async (transactionManager) => {
      try {
        await runInTransaction(transactionManager);
      } catch (error: any | IError) {
        throw new ServerError(`Transaction failed ${error.message}`,`transaction method ()`)
      }
    });
  }
}
