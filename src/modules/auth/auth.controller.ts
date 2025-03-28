import express from 'express';
import { iAuthService } from './iAuthService';
import { responseClearCookieHandler, responseCookieHandler, responseHandler } from '../../handler/responsehandler';
import { eStatusCode } from '../../interfaces/status_code.enum';
import { eErrorMessage } from '../../interfaces/error_message.enum';
import { AuthService } from './auth.service';
import { iUserSignup } from './auth.interface';
import { ValidationService } from '../../services/validation_services';
import { ENV_ACCESS_TOKEN_EXPIRY, ENV_ACCESS_TOKEN_SECRET } from '../../../secret';
import JWTService from '../../services/jwtService';


class AuthController {
    private readonly authService: iAuthService;
    constructor(
        AuthService: iAuthService,
    ) {
        this.authService = AuthService;
        this.getUserByEmail = this.getUserByEmail.bind(this);
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }

    async getUserByEmail(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const email = String(req.body.email);
            const response = await this.authService.getUserByEmail(email);
            if (response) {
                responseHandler(
                    res,
                    response.statusCode,
                    response.isError,
                    response.message,
                    response?.data
                )
            }
        } catch (error) {
            console.log(error);
            responseHandler(
                res,
                eStatusCode.INTERNAL_SERVER_ERROR,
                true,
                error ? `${error}` : eErrorMessage.ServerError
            );
        }
    }

    // signup for citizen only api
    async register(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const payload: iUserSignup = {
				email: String(req.body.email),
				password: String(req.body.password),
				confirm_password: String(req.body.confirm_password),
                username: String(req.body.username),
                role: String(req.body.role),
			}

			const response = await this.authService.register(payload);
			if (response) {
				responseHandler(
					res,
					response.statusCode,
					response.isError,
					response.message,
					response?.data
				)
			}
		} catch (error) {
			console.log(error);
			responseHandler(
				res,
				eStatusCode.INTERNAL_SERVER_ERROR,
				true,
				error ? `${error}` : eErrorMessage.ServerError
			);
		}
	}

    async login(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const email = String(req.body.email);
            const password = String(req.body.password);
            const response = await this.authService.login(email,password);
            if (response && response.cookie_data) {
				responseCookieHandler(
					res,
					response.statusCode, 
					response.isError,
					response.message,
					response.cookie_data,
					response?.data,
				)
			}
			else if(response){
				responseHandler(
					res,
					response.statusCode,
					response.isError,
					response.message,
					response?.data
				)
			}
        } catch (error) {
            console.log(error);
            responseHandler(
                res,
                eStatusCode.INTERNAL_SERVER_ERROR,
                true,
                error ? `${error}` : eErrorMessage.ServerError
            );
        }
    }

    async logout(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
			const user = req.body.userDetails;
			const response = await this.authService.signOut(user);
			if (response && response.cookie_data) {
				responseClearCookieHandler(
					res,
					response.statusCode,
					response.isError,
					response.message,
					response.cookie_data,
					response?.data,
				)
			}
			else if(response){
				responseHandler(
					res,
					response.statusCode,
					response.isError,
					response.message,
					response?.data
				)
			}
		} catch (error) {
			console.log(error);
			responseHandler(
				res,
				eStatusCode.INTERNAL_SERVER_ERROR,
				true,
				error ? `${error}` : eErrorMessage.ServerError
			);
		}
    }

   


}

const validationServiceInstance = new ValidationService();
const authServiceInstance = new AuthService(validationServiceInstance,JWTService);
export default new AuthController(authServiceInstance);