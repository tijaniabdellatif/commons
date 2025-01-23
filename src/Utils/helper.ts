import { Request, Response, NextFunction } from 'express';

/**
 * Function to capitalize the first letter of a string
 * @param str 
 * @returns string
 */
export function firstLetterUppercase(str: string): string {
  const valueString = str.toLowerCase();
  return valueString
    .split(' ')
    .map(
      (value: string) =>
        `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`
    )
    .join(' ');
}

/**
 * Function to convert a string to lowercase
 * @param str 
 * @returns  string
 */
export function lowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * Function to convert a string to uppercase
 * @param str 
 * @returns string
 */
export const toUpperCase = (str: string): string => {
  return str ? str.toUpperCase() : str;
};


/**
 * Function to check if a string is an email using Regex
 * @param email 
 * @returns boolean
 */
export function isEmail(email: string): boolean {
  const regexExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
  return regexExp.test(email);
}

/**
 * Function to check if a string is a URL using Regex
 * @param value 
 * @returns : boolean
 */
export function isDataURL(value: string): boolean {
  const dataUrlRegex =
    /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*)\s*$/i;
  return dataUrlRegex.test(value);
}

/**
 * Handle asynchronous actions and errors in Express
 * @param thefunc 
 * @returns Promise
 */
export const catchAsynError =
  (thefunc: CallableFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(thefunc(req, res, next)).catch(next);
  };
