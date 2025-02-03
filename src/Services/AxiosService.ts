import { ServerError } from '../Error/ErrorHandler';
import { IApiStrategy } from './http/IApiStrategy';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class AxiosService {
  private static instance: AxiosService;
  private strategy?: IApiStrategy;
  private axiosInstance?: AxiosInstance;

  private constructor() {}

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }

    return AxiosService.instance;
  }

  public setStrategy(
    strategy: IApiStrategy,
    baseUrl: string,
    serviceName?: string
  ): void {
    this.strategy = strategy;
    this.axiosInstance = strategy.createInstance(baseUrl, serviceName);
  }

  private replaceUrlParams(
    url: string,
    params: Record<string, string>
  ): string {
    return url.replace(/:([a-zA-Z]+)/g, (_, key) => params[key] || `:${key}`);
  }

  public async request<T = any>(
    config: AxiosRequestConfig,
    params?: Record<string, string>
  ): Promise<T> {
    if (!this.axiosInstance) {
      throw new ServerError(
        'AxiosService; No Strategy set. Call Strategy first',
        'Axios Service request() method'
      );
    }

    if (config.url && params) {
      config.url = this.replaceUrlParams(config.url, params);
    }

    const response: AxiosResponse<T> = await this.axiosInstance.request<T>(
      config
    );
    return response.data;
  }
}



export const ApiService = AxiosService.getInstance();