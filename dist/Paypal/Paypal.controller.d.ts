import { PaypalService } from "./Paypay.service";
import { Request, Response } from "express";
import { Checkout } from "./DTO/checkout.dto";
import { User } from "src/User/Schema/User.Schema";
export declare class PaypalController {
    private paypalservice;
    constructor(paypalservice: PaypalService);
    PayPal(response: Response, checkout: Checkout, user: User): Promise<void>;
    Home(): void;
    Success(response: Response, request: Request): Promise<void>;
}
