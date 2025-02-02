import { Application, RequestHandler } from 'express';
import { ControllerInterface } from './RouteInterface';
import { Router } from './Router';

export class RouterInitializer {
  private controllers: ControllerInterface[];
  private globalMiddlewares: RequestHandler[];

  constructor(
    controllers: ControllerInterface[],
    globalMiddlewares: RequestHandler[] = []
  ) {
    if (controllers.length === 0) {
      throw new Error('No controllers provided');
    }

    this.controllers = controllers;
    this.globalMiddlewares = globalMiddlewares;
  }

  public initialize(app: Application): void {
    this.applyGlobalMiddlewares(app);
    this.controllers.forEach((controller) => {
      controller.routes.forEach((route) => {
        const routeHandler = new Router(
          route.path,
          route.method,
          route.handler,
          route.middlewares
        );

        routeHandler.handle(app);
      });
    });
  }

  private applyGlobalMiddlewares(app: Application): void {
    this.globalMiddlewares.forEach((middleware) => {
      app.use(middleware);
    });
  }
}
