import axios,{AxiosInstance} from 'axios';
import { IApiStrategy } from './IApiStrategy';


export class BasicApiStrategy implements IApiStrategy {

    public createInstance(baseUrl: string, serviceName?: string) {
          return axios.create({
             baseURL:baseUrl,
             headers:{

                "Content-Type":"application/json",
                Accept:'application/json',
                withCredentials: true

             }
          })
    }
}