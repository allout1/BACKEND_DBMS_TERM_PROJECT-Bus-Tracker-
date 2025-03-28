import express from 'express';
import { CommonRoutesConfig } from '../config/router_config/common.route.config';
import locationController from '../modules/location/location.controller';


export class LocationRoutes extends CommonRoutesConfig {
    constructor(app: express.Application, basePath: string, version: string) {
        super(app, 'LocationRoutes', basePath, version);
    }

    configureRoutes() {
        this.app
            .route(`/${this.basePath}/${this.version}/location/add`)
            .post(locationController.addLocation);

        this.app
            .route(`/${this.basePath}/${this.version}/location/get`)
            .get(locationController.getLocations);
        this.app
            .route(`/${this.basePath}/${this.version}/location/getById`)
            .get(locationController.getLocationById);
        this.app
            .route(`/${this.basePath}/${this.version}/location/update`)
            .put(locationController.updateLocation)


        return this.app;
    }
}