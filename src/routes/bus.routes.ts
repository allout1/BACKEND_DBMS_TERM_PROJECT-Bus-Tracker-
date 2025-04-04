import express from 'express';
import { CommonRoutesConfig } from '../config/router_config/common.route.config';
import busController from '../modules/bus/bus.controller';


export class BusRoutes extends CommonRoutesConfig {
    constructor(app: express.Application, basePath: string, version: string) {
        super(app, 'BusRoutes', basePath, version);
    }

    configureRoutes() {
        this.app
            .route(`/${this.basePath}/${this.version}/bus/add`)
            .post(busController.addBus);

        this.app
            .route(`/${this.basePath}/${this.version}/bus/get`)
            .get(busController.getAllBuses);
        this.app
            .route(`/${this.basePath}/${this.version}/bus/getByDestination`)
            .get(busController.getBusByDestination);
            
        this.app
            .route(`/${this.basePath}/${this.version}/bus/delete`)
            .delete(busController.deleteBus);


        return this.app;
    }
}