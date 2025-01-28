import {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { RouteInterface } from './RouteInterface';

export class RouterInitializer {
  protected handlers: RouteInterface[];
  private middlewareMap: Record<string, RequestHandler[]>;

  constructor(
    handlers: RouteInterface[] = [],
    middlewareMap: Record<string, RequestHandler[]> = {}
  ) {
    if (handlers.length === 0) {
      throw new Error('No route handlers provided');
    }

    this.handlers = handlers;
    this.middlewareMap = middlewareMap;
  }

  public initialize(
    app: Application,
  ): void {
    // Apply middlewares before setting up routes
    this.chainHandlers().handle(app);
    this.applyMiddlewares(app);

    // Chain and handle routes
   
  }

  private chainHandlers(): RouteInterface {
    this.handlers.reduce((prev, current) => prev.setNext(current));
    return this.handlers[0];
  }

  private applyMiddlewares(
    app: Application,
  ): void {
    Object.entries(this.middlewareMap).forEach(([path, middlewares]) => {
      app.use(path, ...middlewares);
    });
  }

  public getHandlers(): RouteInterface[] {
    return this.handlers;
  }
}
