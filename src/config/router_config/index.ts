import express from 'express';
import { CommonRoutesConfig } from './common.route.config';
import { AuthRoutes } from '../../routes/auth.routes';
import { LocationRoutes } from '../../routes/location.routes';

const apiVersion = 'v1';
const baseRouterPath = 'api';


class RouterConfig {
    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    configureRoutes(): Array<CommonRoutesConfig> {
        const routes: Array<CommonRoutesConfig> = [
            new AuthRoutes(this.app,baseRouterPath,apiVersion),
            new LocationRoutes(this.app,baseRouterPath,apiVersion),
        ];
        return routes;
    }
}

export default RouterConfig;