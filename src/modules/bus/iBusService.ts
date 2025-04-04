import { serviceResponse } from "../../interfaces/response.types";
import { BUS } from "./bus.interface";

export interface iBusService {
    addBus: (
        busData: BUS
    ) => Promise<serviceResponse>;

    getAllBuses: (
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

}