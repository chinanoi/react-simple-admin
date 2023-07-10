import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthenticationException extends HttpException {
  constructor(message: string) {
    super(
      {
        code: 403,
        message: message,
      },
      HttpStatus.OK,
    );
  }
}
