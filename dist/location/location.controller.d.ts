import { LocationService } from "./location.service";
export declare class LocationController {
    private location;
    constructor(location: LocationService);
    findAll(): import("rxjs").Observable<any>;
    findDistrict(code: any): any;
    findWards(code: any): any;
}
