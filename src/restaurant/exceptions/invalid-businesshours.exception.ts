import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidBusinessHours extends HttpException {
  constructor(error: string) {
    super(
      `Something went wrong in businessHours property: ${error}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
