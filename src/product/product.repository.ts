import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/entity.repository';
import { Product, ProductDocument } from './schema/product.schema';

@Injectable()
export class ProductRepository extends EntityRepository<ProductDocument> {
  constructor(@InjectModel(Product.name) productModel: Model<ProductDocument>) {
    super(productModel);
  }
}
