import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../product.repository';
import { ProductNotFound } from '../exceptions/product-not-found.exception';

@Injectable()
export class ProductMiddleware implements NestMiddleware {
  constructor(private readonly productRepository: ProductRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const product = await this.productRepository.findOne({ _id: id });

    if (!product) {
      throw new ProductNotFound(id);
    }

    next();
  }
}
