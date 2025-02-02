import { Application, RequestHandler } from 'express';
import { RouteInterface } from './RouteInterface';
import { HTTPMethods } from '../types/types';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export abstract class AbstractRouteHandler implements RouteInterface {
  path: string;
  method: HTTPMethods;
  handler: RequestHandler;
  middlewares: RequestHandler<
    ParamsDictionary,
    any,
    any,
    ParsedQs,
    Record<string, any>
  >[];
  protected nextHandler: AbstractRouteHandler | null = null;

  constructor(
    path: string,
    method: HTTPMethods,
    handler: RequestHandler,
    middlewares: RequestHandler[]
  ) {
    this.path = path;
    this.method = method;
    this.handler = handler;
    this.middlewares = middlewares;
  }

  setNext(handler: AbstractRouteHandler): AbstractRouteHandler {
    this.nextHandler = handler;
    return handler;
  }

  abstract handle(app: Application): void;
}
