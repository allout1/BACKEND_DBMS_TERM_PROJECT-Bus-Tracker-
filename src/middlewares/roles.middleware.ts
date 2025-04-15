import express from 'express';
import { responseHandler } from '../handler/responsehandler';
import { eStatusCode } from '../interfaces/status_code.enum';
import { eErrorMessage } from '../interfaces/error_message.enum';
import JWTService from '../services/jwtService';
import { iUser } from '../modules/auth/auth.interface';


class RolesMiddleware {

    verifyRole(allowedRoles: string[]) {
        return async (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ): Promise<void> => {
            try {
                const role = req.body.userDetails.role;
                if (!allowedRoles.includes(role)) {
                    throw eErrorMessage.Unauthorised;
                }
                next();                
            } catch (error) {
                console.log(error);
                responseHandler(
                    res,
                    eStatusCode.UNAUTHORIZED,
                    true,
                    eErrorMessage.Unauthorised,
                    "Your role is not authorized to access this"
                )
            }
        }
    }
    
    
}

export default new RolesMiddleware();