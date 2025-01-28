import { Application } from 'express';

export interface RouteInterface {
  setNext(handler: RouteInterface): RouteInterface;
  handle(app: Application): void;
}
