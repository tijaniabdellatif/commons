import { Application,Request,Response,NextFunction } from 'express';
import { RouteInterface } from './RouteInterface';

export class RouterInitializer {
  protected handlers: RouteInterface[];

  constructor(handlers: RouteInterface[] = []) {
    if (handlers.length === 0) {
      throw new Error('No route handlers provided');
    }

    this.handlers = handlers;
  }

  public initialize(app: Application, middlewares: ((req: Request, res: Response, next: NextFunction) => void)[] = []): void {
    // Apply middlewares before setting up routes
    this.applyMiddlewares(app, middlewares);

    // Chain and handle routes
    this.chainHandlers().handle(app);
  }

  private chainHandlers(): RouteInterface {
    this.handlers.reduce((prev, current) => prev.setNext(current));
    return this.handlers[0];
  }

  private applyMiddlewares(app: Application, middlewares: ((req: Request, res: Response, next: NextFunction) => void)[]): void {
    middlewares.forEach((middleware) => app.use(middleware));
  }

  public getHandlers(): RouteInterface[] {
    return this.handlers;
  }
}
