import express from 'express';
import { iLocationService } from './iLocationService';
import { responseClearCookieHandler, responseCookieHandler, responseHandler } from '../../handler/responsehandler';
import { eStatusCode } from '../../interfaces/status_code.enum';
import { eErrorMessage } from '../../interfaces/error_message.enum';
import { ValidationService } from '../../services/validation_services';
import { ENV_ACCESS_TOKEN_EXPIRY, ENV_ACCESS_TOKEN_SECRET } from '../../../secret';
import JWTService from '../../services/jwtService';
import { LocationService } from './location.service';


class LocationController {
    private readonly locationService: iLocationService;
    constructor(
        LocationService: iLocationService,
    ) {
        this.locationService = LocationService;
        this.addLocation = this.addLocation.bind(this);
        this.getLocations = this.getLocations.bind(this);
        this.getLocationById = this.getLocationById.bind(this);
        this.updateLocation = this.updateLocation.bind(this);        
    }

    async addLocation(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const name = String(req.body.name);
            const coordinates = req.body.coordinates;
            const response = await this.locationService.addLocation(name, coordinates);
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
    async getLocations(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const response = await this.locationService.getLocations();
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
    async getLocationById(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const id = String(req.query.id);
            const response = await this.locationService.getLocationById(id);
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
    async updateLocation(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        try {
            const id = String(req.body.id);
            const name = req.body.name?String(req.body.name):null;
            const coordinates = req.body.coordinates?req.body.coordinates:null;
            const response = await this.locationService.updateLocation(id, name, coordinates);
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
const locationServiceInstance = new LocationService(validationServiceInstance,JWTService);
export default new LocationController(locationServiceInstance);