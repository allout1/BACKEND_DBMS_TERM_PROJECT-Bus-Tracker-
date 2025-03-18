import express from 'express';
import { CommonRoutesConfig } from './common.route.config';

const apiVersion = 'v1';
const baseRouterPath = 'api';


class RouterConfig {
    private app: express.Application;

    constructor(app: express.Application) {
        this.app = app;
    }

    configureRoutes(): Array<CommonRoutesConfig> {
        const routes: Array<CommonRoutesConfig> = [

        ];
        return routes;
    }
}

export default RouterConfig;