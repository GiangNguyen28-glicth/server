import { LocationService } from "./location.service";
export declare class LocationController {
    private location;
    constructor(location: LocationService);
    findAll(): Promise<any>;
    findDistrict(code: any): Promise<any>;
    findWards(code: any): Promise<any>;
}
