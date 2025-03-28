import express from 'express';
import { CommonRoutesConfig } from '../config/router_config/common.route.config';
import authController from '../modules/auth/auth.controller';


export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application, basePath: string, version: string) {
        super(app, 'AuthRoutes', basePath, version);
    }

    configureRoutes() {
        this.app
            .route(`/${this.basePath}/${this.version}/auth/register`)
            .post(authController.register);

        this.app
            .route(`/${this.basePath}/${this.version}/auth/login`)
            .post(authController.login)


        return this.app;
    }
}