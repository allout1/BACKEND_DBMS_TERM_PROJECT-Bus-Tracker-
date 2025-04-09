import { LocationType } from "../../models/location.model"

export interface BUS{
    bus_number: string,
    stoppage:{
        location_id:string,
        time: number
    }[],
}

export interface IBUSadd{
    bus_number: string,
    stoppage:{
        location:LocationType,
        time: number
    }[],
    driver: string
}