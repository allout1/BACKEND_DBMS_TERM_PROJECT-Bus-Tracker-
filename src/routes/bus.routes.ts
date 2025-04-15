import express from 'express';
import { CommonRoutesConfig } from '../config/router_config/common.route.config';
import busController from '../modules/bus/bus.controller';
import authMiddleware from '../middlewares/auth.middleware';
import rolesMiddleware from '../middlewares/roles.middleware';


export class BusRoutes extends CommonRoutesConfig {
    constructor(app: express.Application, basePath: string, version: string) {
        super(app, 'BusRoutes', basePath, version);
    }

    configureRoutes() {
        this.app
            .route(`/${this.basePath}/${this.version}/bus/add`)
            .post([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                busController.addBus
            ]);

        this.app
            .route(`/${this.basePath}/${this.version}/bus/get`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'user']),
                busController.getAllBuses
            ]);

        this.app
            .route(`/${this.basePath}/${this.version}/bus/getByDestination`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'user']),
                busController.getBusByDestination
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/bus/getById`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'user']),
                busController.getBusById
            ]);
            
        this.app
            .route(`/${this.basePath}/${this.version}/bus/delete`)
            .delete([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                busController.deleteBus
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/bus/getByDriver`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'driver']),
                busController.getBusByDriver
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/bus/assignDriver`)
            .post([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                busController.assignDriver
            ]);
        this.app
            .route(`/${this.basePath}/${this.version}/bus/getDrivers`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin']),
                busController.getDrivers
            ]);

        this.app
            .route(`/${this.basePath}/${this.version}/bus/getAllBusDetails`)
            .get([
                authMiddleware.verifyToken,
                rolesMiddleware.verifyRole(['admin', 'user']),
                busController.getAllBusDetails
            ]);

        return this.app;
    }
}