import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidTimeOnSale extends HttpException {
  constructor(error: string) {
    super(
      `Something went wrong in timeOnSale property: ${error}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
