export interface IApiStrategy {
  createInstance(baseUrl:string,serviceName?:string):any;
}
