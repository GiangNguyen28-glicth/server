import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { CommonService } from "src/Utils/common.service";
export declare class PaypalService {
    private userservice;
    private commonservice;
    constructor(userservice: UserService, commonservice: CommonService);
    total: number;
    usercheckout: User;
    Payment(response: any, money: number, user: User): Promise<void>;
    Success(response: any, request: any): Promise<void>;
    convertmoney(usdinput: number): Promise<number>;
}
