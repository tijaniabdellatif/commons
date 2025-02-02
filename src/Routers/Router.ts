import { Application } from 'express';
import { AbstractRouteHandler } from './AbstractRouteHandler';

export class Router extends AbstractRouteHandler {
  handle(app: Application): void {
    if (this.middlewares) {
      app[this.method](this.path, ...this.middlewares, this.handler);
    } else {
      app[this.method](this.path, this.handler);
    }

    if (this.nextHandler) {
      this.nextHandler.handle(app);
    }
  }
}
