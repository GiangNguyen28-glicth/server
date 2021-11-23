import { User } from "src/User/Schema/User.Schema";
import { confirmEmail } from "./confirm.dto";
import { MailService } from "./mail.service";
export declare class MailController {
    private mailservice;
    constructor(mailservice: MailService);
    confirm(token: confirmEmail): Promise<string>;
    resendConfirmationLink(user: User): Promise<void>;
}
