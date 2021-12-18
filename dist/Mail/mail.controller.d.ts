import { confirmEmail } from "./confirm.dto";
import { MailService } from "./mail.service";
import { Response } from "express";
export declare class MailController {
    private mailservice;
    constructor(mailservice: MailService);
    confirm(token: confirmEmail, response: Response): Promise<void>;
}
