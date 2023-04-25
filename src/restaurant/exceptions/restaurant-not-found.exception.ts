import { HttpException, HttpStatus } from '@nestjs/common';

export class RestaurantNotFound extends HttpException {
  constructor(id: string) {
    super(`Restaurant with ${id} not found!`, HttpStatus.NOT_FOUND);
  }
}
