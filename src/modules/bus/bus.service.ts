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
            var location: any;
            if(busData.bus_location_id){
                location = await Location.findById(busData.bus_location_id);
                if(!location){
                    response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Location not found");
                    return response;
                }
            }
            // now i have array of ids of locations in stoppage
            // i want to find the location by id and push it to new stoppage array
            const stoppage = busData.stoppage.map(async (stop) => {
                const loc= await Location.findById(stop.location_id);
                if (!loc) {
                    response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Location not found");
                    return response;
                }
                return { location: location, time: stop.time };
            });
            // wait for all the promises to resolve
            const newBusData = {
                bus_number: busData.bus_number,
                bus_location: location,
                bus_stoppage: stoppage,
                driver: busData.driver,
            }

            // add a bus to the database bus model
            const bus = await new BusModel(newBusData).save();
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
            const buses = await BusModel.find({});

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
    

}