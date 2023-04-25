import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidBusinessHours extends HttpException {
  constructor(error: string) {
    super(
      `Invalid format in businessHours property: ${error}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
