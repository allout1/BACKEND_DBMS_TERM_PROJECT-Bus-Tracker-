import express from 'express';
import { responseClearCookieHandler, responseCookieHandler, responseHandler } from '../../handler/responsehandler';
import { eStatusCode } from '../../interfaces/status_code.enum';
import { eErrorMessage } from '../../interfaces/error_message.enum';
import { ValidationService } from '../../services/validation_services';
import { ENV_ACCESS_TOKEN_EXPIRY, ENV_ACCESS_TOKEN_SECRET } from '../../../secret';
import JWTService from '../../services/jwtService';
import { BUS } from "./bus.interface";
import { BusService } from './bus.service';
import { iBusService } from './iBusService';
class BusController {
    private readonly busService: iBusService;
    constructor(
        BusService: iBusService,
    ) {
        this.busService = BusService;
        this.addBus = this.addBus.bind(this);
        this.getAllBuses = this.getAllBuses.bind(this);
        this.getBusByDestination = this.getBusByDestination.bind(this);
        this.deleteBus = this.deleteBus.bind(this);   
        this.getBusById = this.getBusById.bind(this);   
        this.getBusByDriver = this.getBusByDriver.bind(this);
    }

    async addBus(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const busData :BUS = {
                bus_number: String(req.body.bus_number),
                stoppage: req.body.stoppage,
                driver: String(req.body.driver)
            }
            const response = await this.busService.addBus(busData);
            if (response) {
                responseHandler(
                    res,
                    response.statusCode,
                    response.isError,
                    response.message,
                    response?.data
                )
            }
        } 
        catch (error) {
            console.log(error);
            responseHandler(
                res,
                eStatusCode.INTERNAL_SERVER_ERROR,
                true,
                error ? `${error}` : eErrorMessage.ServerError
            );
        }
    }
    async getAllBuses(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const response = await this.busService.getAllBuses();
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
    async getBusByDestination(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const destination = String(req.query.destination);
            const response = await this.busService.getBusByDestination(destination);
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
    async deleteBus(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const id = String(req.query.id);
            const response = await this.busService.deleteBus(id);
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
   async getBusById(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const busId = String(req.query.busId);
            const response = await this.busService.getBusById(busId);
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
    async getBusByDriver(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            console.log("body:",req.body.userDetails);
            const driver = String(req.body.userDetails.id);
            console.log("driver",driver);
            const response = await this.busService.getBusByDriver(driver);
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
    
}

const validationServiceInstance = new ValidationService();
const busServiceInstance = new BusService(validationServiceInstance,JWTService);
export default new BusController(busServiceInstance);