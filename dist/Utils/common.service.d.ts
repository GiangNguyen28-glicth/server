import { HttpService } from "@nestjs/axios";
import { Observable } from "rxjs";
export declare class CommonService {
    private httpService;
    constructor(httpService: HttpService);
    findAll(): Promise<Observable<any>>;
    continueApp(obj1: number, obj2: number): Promise<void>;
    convertDatetime(date: Date): Date;
}
