import { StatusCodes } from 'http-status-codes';

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
    status = 'error';
  
    constructor(message: string, comingFrom: string) {
      super(message, comingFrom);
    }
  }
  
  export class NotFound extends ErrorHandler {
    statusCode = StatusCodes.NOT_FOUND;
    status = 'error';
  
    constructor(message: string, comingFrom: string) {
      super(message, comingFrom);
    }
  }
  
  export class NotAuthorized extends ErrorHandler {
    statusCode = StatusCodes.UNAUTHORIZED;
    status = 'error';
  
    constructor(message: string, comingFrom: string) {
      super(message, comingFrom);
    }
  }
  
  export class FileToLarge extends ErrorHandler {
    statusCode = StatusCodes.REQUEST_TOO_LONG;
    status = 'error';
  
    constructor(message: string, comingFrom: string) {
      super(message, comingFrom);
    }
  }
  
  export class ServerError extends ErrorHandler {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    status = 'server Error';
  
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
  