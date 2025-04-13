import { serviceResponse } from "../../interfaces/response.types";
import { BUS } from "./bus.interface";

export interface iBusService {
    addBus: (
        busData: BUS
    ) => Promise<serviceResponse>;

    getAllBuses: (
        flag: boolean
    ) => Promise<serviceResponse>;
    getBusByDestination: (
        destination: string
    ) => Promise<serviceResponse>;
    getBusById: (
        busId: string
    ) => Promise<serviceResponse>;
    deleteBus: (
        busId: string
    ) => Promise<serviceResponse>;

    getBusByDriver:(
        driver: string
    )=> Promise<serviceResponse>;

    assignDriver: (
        busId: string,
        driverId: string
    ) => Promise<serviceResponse>;

    getDrivers: (
    ) => Promise<serviceResponse>;

    getAllBusDetails:() => Promise<serviceResponse>;

}