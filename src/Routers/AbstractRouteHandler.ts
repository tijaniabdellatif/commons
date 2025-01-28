import { Application } from 'express';
import { RouteInterface } from './RouteInterface';

export abstract class AbstractRouteHandler implements RouteInterface {
  private nextHandler: RouteInterface | null = null;
  setNext(handler: RouteInterface): RouteInterface {
    this.nextHandler = handler;
    return handler;
  }

  handle(app: Application): void {
    if (this.nextHandler) {
      this.nextHandler.handle(app);
    }
  }
}
