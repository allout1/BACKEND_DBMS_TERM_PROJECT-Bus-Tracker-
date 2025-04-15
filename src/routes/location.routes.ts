import express from 'express';
import { CommonRoutesConfig } from '../config/router_config/common.route.config';
import locationController from '../modules/location/location.controller';
import authMiddleware from '../middlewares/auth.middleware';
import rolesMiddleware from '../middlewares/roles.middleware';


export class LocationRoutes extends CommonRoutesConfig {
    constructor(app: express.Application, basePath: string, version: string) {
        super(app, 'LocationRoutes', basePath, version);
    }

    configureRoutes() {
        this.app
            .route(`/${this.basePath}/${this.version}/location/add`)
            .post([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                locationController.addLocation
            ]);

        this.app
            .route(`/${this.basePath}/${this.version}/location/get`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'user']),
                locationController.getLocations
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/location/getById`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'user']),
                locationController.getLocationById
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/location/update`)
            .put([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                locationController.updateLocation
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/location/delete`)
            .delete([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                locationController.deleteLocation
            ])
            


        return this.app;
    }
}