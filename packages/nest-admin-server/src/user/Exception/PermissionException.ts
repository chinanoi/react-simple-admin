import { HttpException, HttpStatus } from '@nestjs/common';

export class PermissionException extends HttpException {
  constructor(message: string) {
    super(
      {
        code: 401,
        message: message,
      },
      HttpStatus.OK,
    );
  }
}
