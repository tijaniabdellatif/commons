// import JWT from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
// import { NotAuthorized } from './error-handler';
// import { GateWay } from './Enums';

// const tokens: string[] = [
//    GateWay.AUTH,
//    GateWay.BUYER,
//    GateWay.SELLER,
//    GateWay.ORDER,
//    GateWay.REVIEW,
//    GateWay.GIG,
//    GateWay.SEARCH,
//    GateWay.MESSAGE
// ];

// export function verifyGatewayRequest(
//   req: Request,
//   _res: Response,
//   next: NextFunction
// ): void {
//   if (!req.headers?.gatewaytoken) {
//     throw new NotAuthorized(
//       'Invalid Request',
//       "VerifyGatewayRequest() method: Request not allowed it's not coming from the api gateway"
//     );
//   }

//   const token: string = req.headers?.gatewaytoken as string;
//   if (!token) {
//     throw new NotAuthorized(
//       'Invalid Request',
//       "VerifyGatewayRequest() method: Request not allowed it's not coming from the api gateway"
//     );
//   }

//   try {
//     const payload: { id: string; iat: number } = JWT.verify(token, 'e3b7da441b90b26ef838b609e0ca4ebd') as {
//       id: string;
//       iat: number;
//     };
//     if(!tokens.includes(payload.id)){
//         throw new NotAuthorized(
//             'Invalid Request',
//             "VerifyGatewayRequest() method: Request payload is invalid"
//           );
//     }

//   } catch (error) {
//     console.error('Something is wrong');

//     throw new NotAuthorized(
//       'Invalid Request',
//       "VerifyGatewayRequest() method: Request not allowed it's not coming from the api gateway"
//     );
//   }

//   next();
// }
