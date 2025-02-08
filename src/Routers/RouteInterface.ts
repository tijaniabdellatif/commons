import {  RequestHandler } from 'express';
import { HTTPMethods } from '../types/types';

export interface RouteInterface {
  path:string;
  method: HTTPMethods;
  handler:RequestHandler;
  middlewares: RequestHandler[];
  // setNext(handler: RouteInterface): RouteInterface;
  // handle(app: Application): void;
}

export interface ControllerInterface {
  routes: RouteInterface[];
}
