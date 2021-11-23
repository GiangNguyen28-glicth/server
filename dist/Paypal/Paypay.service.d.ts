import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
export declare class PaypalService {
    private userservice;
    constructor(userservice: UserService);
    total: number;
    usercheckout: User;
    Payment(response: any, money: number, user: User): Promise<void>;
    Success(response: any, request: any): Promise<void>;
}
