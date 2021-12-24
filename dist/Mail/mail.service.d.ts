import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service";
export declare class MailService {
    private userService;
    private jwtservice;
    constructor(userService: UserService, jwtservice: JwtService);
    sendEmail(email: string, option: string, code?: string, fullname?: string, message?: string): Promise<void>;
    decodeConfirmationToken(token: string): Promise<any>;
    confirmEmail(email: string): Promise<void>;
    configtemplate(option: string, code?: string, fullname?: string, message?: string, token?: string): any;
}
