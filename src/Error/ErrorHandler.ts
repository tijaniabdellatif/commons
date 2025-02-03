import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
  serializer(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
  comingFrom: string;
}

export abstract class ErrorHandler extends Error {
  abstract statusCode: number;
  abstract status: string;
  comingFrom: string;

  constructor(message: string, comingFrom: string) {
    super(message);
    this.comingFrom = comingFrom;
  }

  serializer(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      comingFrom: this.comingFrom,
    };
  }
}

export class BadRequestError extends ErrorHandler {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'BAD REQUEST';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class NotFound extends ErrorHandler {
  statusCode = StatusCodes.NOT_FOUND;
  status = 'NOT FOUND';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class NotAuthorized extends ErrorHandler {
  statusCode = StatusCodes.UNAUTHORIZED;
  status = 'NOT AUTHORIZED';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class FileToLarge extends ErrorHandler {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  status = 'File TO LARGE';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class ServerError extends ErrorHandler {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  status = 'INTERNAL SERVER ERROR';

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export class ValidationProccessError extends ErrorHandler {
  statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  status = ReasonPhrases.UNPROCESSABLE_ENTITY;

  constructor(message: string, comingFrom: string) {
    super(message, comingFrom);
  }
}

export interface ErrnoException extends Error {
  errno?: number;
  code?: string;
  path?: string;
  syscall?: string;
  stack?: string;
}
