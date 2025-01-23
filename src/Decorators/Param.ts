import { Request } from "express";


export function Param(key:string) : ParameterDecorator {
    
      return (target: Object, propertyKey: string | symbol, parameterIndex: number) => {

         const existingParam = Reflect.getMetadata('param', target, propertyKey) || [];
        existingParam.push({key, index:parameterIndex});
        Reflect.defineMetadata('params', existingParam, target, propertyKey);
      }
}