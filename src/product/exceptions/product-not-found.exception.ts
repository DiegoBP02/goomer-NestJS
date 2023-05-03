import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFound extends HttpException {
  constructor(id: string) {
    super(`Product with ${id} not found!`, HttpStatus.NOT_FOUND);
  }
}
