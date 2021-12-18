import { PaypalService } from "./Paypay.service";
import { Request, Response } from "express";
import { Checkout } from "./DTO/checkout.dto";
import { User } from "src/User/Schema/User.Schema";
import { CommonService } from "src/Utils/common.service";
export declare class PaypalController {
    private paypalservice;
    private commonservice;
    constructor(paypalservice: PaypalService, commonservice: CommonService);
    PayPal(response: Response, checkout: Checkout, user: User): Promise<void>;
    Success(response: Response, request: Request, checkout: Checkout): Promise<void>;
    Test(): Promise<number>;
    Cancel(response: Response, request: Request): string;
    getMoney(): Promise<number>;
}
