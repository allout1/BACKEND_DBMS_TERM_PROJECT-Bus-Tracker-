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
                // this.validatorService.validString("Driver", busData.driver);                
            } 
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // see if a bus with same bus number exists
            const busExists = await BusModel.findOne({ bus_number: busData.bus_number });
            if (busExists) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Bus already exists");
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
        flag: boolean
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get buses",
        }
        try {
            // get all buses from the database bus model
            let buses;
            if(flag) {
                buses = await BusModel.find({ driver: { $eq: null } },{
                    // return only bus_number and id
                    bus_number: 1,
                    _id: 1,
                });
            }
            else{
                buses = await BusModel.find({},{
                    // return only bus_number and id
                    bus_number: 1,
                    _id: 1,
                });
            }

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
            const bus = await BusModel.findById(busId)
            .select("-__v -createdAt -updatedAt -stoppage._id")
            .populate({
                path: "driver",
                select: "-password -__v -email -createdAt -updatedAt",
            }).populate({
                path: "stoppage.location",
                select: "-__v",
            });
            
            
            response = setResponse(response, eStatusCode.OK, false,"Bus fetched successfully",bus);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    async getBusByDriver(
        driver: string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get bus",
        }
        try {
            try{
                this.validatorService.validString("Driver", driver);
            }
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }

            // get bus by driver from the database bus model
            const bus = await BusModel.findOne({driver},{
                // return only bus_number and id
                bus_number: 1,
                _id: 1,
            });

            if(!bus) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Driver not registered with any bus");
                return response;
            }

            response = setResponse(response, eStatusCode.OK, false,"Bus fetched successfully",bus);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }

    async assignDriver(
        busId: string,
        driver: string
    ): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to assign driver",
        }
        try {
            try{
                this.validatorService.validString("BusId", busId);
                this.validatorService.validString("Driver", driver);
            }
            catch (error: any) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, error);
                return response;
            }
            // check the bus exists or not
            let bus = await BusModel.findById(busId);
            if(!bus) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Bus not found");
                return response;
            }
            // check the driver exists or not
            const driverExists = await User.findById(driver);
            if(!driverExists || driverExists.role !== "driver") {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Driver not found");
                return response;
            }

            // check whether the driver is registered with a bus (if registered remove from that bus)
            const driverBus = await BusModel.findOne({driver});
            if(driverBus) {
                driverBus.driver = null;
                await driverBus.save();
            }

            // assign driver to the bus by id from the database bus model
            bus = await BusModel.findByIdAndUpdate(busId,{driver},{new:true});

            if(!bus) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "Driver not assigned");
                return response;
            }

            response = setResponse(response, eStatusCode.OK, false,"Driver assigned successfully");
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }
    
    async getDrivers(): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get drivers",
        }
        try {
            // get all drivers from the database user model
            const drivers = await User.find({role:"driver"}).select({
                username:1,
                email:1,
                _id:1
            });

            response = setResponse(response, eStatusCode.OK, false,"Drivers fetched successfully",drivers);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }

    async getAllBusDetails(): Promise<serviceResponse> {
        let response: serviceResponse = {
            statusCode: eStatusCode.BAD_REQUEST,
            isError: true,
            message: "failed to get bus details",
        }
        try {
            // get all buses from the database bus model
            const buses = await BusModel.find()
                        .populate({
                            path: 'stoppage.location',
                            model: 'Location',
                            select: "-__v "
                        })
                        .populate({
                            path: 'driver',
                            model: 'User',
                            select: "-password -__v -email -createdAt -updatedAt",
                        })
                        .select("-__v -createdAt -updatedAt -stoppage._id");

            if(!buses) {
                response = setResponse(response, eStatusCode.BAD_REQUEST, true, "No buses found");
                return response;
            }
            response = setResponse(response, eStatusCode.OK, false,"Bus details fetched successfully",buses);
            return response;
        } catch (error) {
            console.log("error: ", error);
            return response;
        }
    }

}