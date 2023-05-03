import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(entityFilterQuery: FilterQuery<T>): Promise<T> {
    return await this.entityModel.findOne(entityFilterQuery).exec();
  }

  async find(entityFilterQuery: FilterQuery<T>): Promise<T[]> {
    return await this.entityModel.find(entityFilterQuery);
  }

  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    return entity.save();
  }

  async findOneAndUpdate(
    entityFilterQuery: FilterQuery<T>,
    updateEntityData: UpdateQuery<unknown>,
  ): Promise<T> {
    return await this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async findOneAndRemove(entityFilterQuery: FilterQuery<T>): Promise<T> {
    return await this.entityModel.findOneAndRemove(entityFilterQuery);
  }
}
