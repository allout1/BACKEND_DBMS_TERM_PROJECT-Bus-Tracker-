
export interface iLocationService {
    addLocation: (
        name: string,
        coordinates: number[]
    ) => Promise<any>;
    getLocations: (

    ) => Promise<any>;
    getLocationById: (
        id: string
    ) => Promise<any>;
    updateLocation: (
        id: string,
        name: string|null,
        coordinates: number[]|null
    ) => Promise<any>;
    deleteLocation: (
        id: string
    ) => Promise<any>;
}
