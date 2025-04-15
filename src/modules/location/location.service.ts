import { setResponse } from "../../handler/responsehandler";
import { eErrorMessage } from "../../interfaces/error_message.enum";
import { serviceResponse } from "../../interfaces/response.types";
import { eStatusCode } from "../../interfaces/status_code.enum";
import { iValidationService } from "../../services/iValidationService";
import { iJwtService } from "../../services/iJwtService";
import { Location } from "../../models/location.model";
import { iLocationService } from "./iLocationService";

export class LocationService implements iLocationService {
    private readonly validatorService: iValidationService;
    private readonly jwtService: iJwtService;

    constructor(validatorService: iValidationService, jwtService: iJwtService) {
        this.validatorService = validatorService;
        this.jwtService = jwtService
    }

    async addLocation(
        name: string,
        coordinates: number[]
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to add location",
        }
        try {
            // validations
            try {
                this.validatorService.validString("Name", name);
                this.validatorService.validCoordinates("Geometry", coordinates);
            } 
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }
            const geometry = {
                type: "Point",
                coordinates
              };

            // add location
            const location = await new Location({name, geometry}).save();

            const result = {
                name: location.name,
                coordinates: location.geometry?.coordinates,
                _id: location._id
            }

            response = setResponse(response, eStatusCode.OK, false,"Location added successfully",result);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async getLocations(

    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get locations",
        }
        try {
            const locations = await Location.aggregate([
            {
                $project: {
                name: 1,
                coordinates: "$geometry.coordinates"
                }
            }
            ]);
              
            response = setResponse(response, eStatusCode.OK, false, "Locations fetched successfully", locations);
            return response;
        }
        catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async getLocationById(
        id:string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get location",
        }
        try{
            try{
                // this.validatorService.validString("Id", id);
            }
            catch(error:any){
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }
            const location = await Location.findById(id);
            if(!location){
                response = setResponse(response, eStatusCode.NOT_FOUND, true, "Location not found");
                return response;
            }
            response = setResponse(response, eStatusCode.OK, false, "Location fetched successfully", location);
            return response;

        }
        catch(error){
            console.log("error: ", error);
            return response;
        }
    }
    async updateLocation(
        id: string,
        name: string|null,
        coordinates: number[]|null
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to update location",
        }
        try{
            try{
                this.validatorService.validString("Id", id);
                if(name){
                    this.validatorService.validString("Name", name);
                }
                if(coordinates){
                    this.validatorService.validCoordinates("Geometry", coordinates);
                }
            }
            catch(error:any){
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }
            const location = await Location.findById(id);
            if(!location){
                response = setResponse(response, eStatusCode.NOT_FOUND, true, "Location not found");
                return response;
            }
            if(name){
                location.name = name;
            }
            if(coordinates){
                if(location.geometry) location.geometry.coordinates = coordinates;
                else{
                    location.geometry = {
                        type: "Point",
                        coordinates
                    }
                }

            }
            await location.save();
            response = setResponse(response, eStatusCode.OK, false, "Location updated successfully", location);
            return response;
        }
        catch(error){
            console.log("error: ", error);
            return response;
        }
    }

}