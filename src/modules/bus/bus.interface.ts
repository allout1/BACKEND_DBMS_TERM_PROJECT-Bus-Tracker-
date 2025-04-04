import { LocationType } from "../../models/location.model"

export interface BUS{
    bus_number: string,
    bus_location_id: string,
    stoppage:{
        location_id:string,
        time: number
    }[],
    driver: string
}

export interface IBUSadd{
    bus_number: string,
    bus_location: LocationType,
    stoppage:{
        location:LocationType,
        time: number
    }[],
    driver: string
}