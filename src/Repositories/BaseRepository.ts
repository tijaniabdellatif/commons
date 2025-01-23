import { Repository, EntityManager, DeepPartial } from 'typeorm';
export class BaseRepository<T extends Object> {
  constructor(
    private repository: Repository<T>,
    private manager: EntityManager
  ) {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<T | null> {
    return await this.repository.findOne({ where: { id } as any });
  }

  async create(data: Partial<T>): Promise<T | T[]> {
    const entity = this.repository.create(data as DeepPartial<T>);
    return await this.repository.save(entity);
  }

  async save(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async transaction(
    runInTransaction: (manager: EntityManager) => Promise<any>
  ): Promise<void> {
    await this.manager.transaction(runInTransaction);
  }
}
