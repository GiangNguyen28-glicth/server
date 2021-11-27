import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
export declare class LocationService {
    private httpService;
    constructor(httpService: HttpService);
    findProvince(): Observable<any>;
    findDistrict(code: any): Observable<any>;
    findWards(code: any): Observable<any>;
}
