import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IApiStrategy {
  createInstance(baseUrl:string,serviceName?:string):any;
  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
}
