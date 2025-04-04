import { setResponse } from "../../handler/responsehandler";
import { eErrorMessage } from "../../interfaces/error_message.enum";
import { serviceResponse } from "../../interfaces/response.types";
import { eStatusCode } from "../../interfaces/status_code.enum";
import { iValidationService } from "../../services/iValidationService";
import { iJwtService } from "../../services/iJwtService";

import { BUS } from "./bus.interface";
import { BusModel } from "../../models/bus.model";
import { iBusService } from "./iBusService";
import { Location } from "../../models/location.model";
import { User } from "../../models/user.model";

export class BusService implements iBusService {
    private readonly validatorService: iValidationService;
    private readonly jwtService: iJwtService;

    constructor(validatorService: iValidationService, jwtService: iJwtService) {
        this.validatorService = validatorService;
        this.jwtService = jwtService
    }

    async addBus(
        busData:BUS
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to add bus",
        }
        try {
            // validations
            try {
                this.validatorService.validString("Name", busData.bus_number);
                this.validatorService.validString("Driver", busData.driver);                
            } 
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // add a bus to the database bus model
            const bus = await new BusModel(busData).save();
            if (!bus) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Bus not added");
                return response;
            }
            response = setResponse(response, eStatusCode.OK, false,"Bus added successfully",);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async getAllBuses(
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get buses",
        }
        try {
            // get all buses from the database bus model
            const buses = await BusModel.find({},{
                // return only bus_number and id
                bus_number: 1,
                _id: 1,
            });

            response = setResponse(response, eStatusCode.OK, false,"Buses fetched successfully",buses);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async getBusByDestination(
        destination: string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get bus",
        }
        try {
            try{
                this.validatorService.validString("Destination", destination);
            }
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // get bus by destination from the database bus model
            const bus = await BusModel.find({stoppage:{$elemMatch:{location:destination}}});

            response = setResponse(response, eStatusCode.OK, false,"Bus fetched successfully",bus);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async deleteBus(
        id:string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to delete bus",
        }
        try {
            // delete bus by id from the database bus model
            const bus = await BusModel.findByIdAndDelete(id);

            response = setResponse(response, eStatusCode.OK, false,"Bus deleted successfully",bus);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async getBusById(
        busId: string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get bus",
        }
        try {
            try{
                this.validatorService.validString("BusId", busId);
            }
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }
            //in the busModel the driver name and location are saved in the form of id referenced to User and location
            // respectively.
            // fetch drivers name and location name as well
            const bus = await BusModel.findById(busId).populate("driver").populate("stoppage.location");
            
            
            response = setResponse(response, eStatusCode.OK, false,"Bus fetched successfully",bus);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    

}