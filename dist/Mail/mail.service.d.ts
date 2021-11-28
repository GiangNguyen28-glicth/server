import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/User/User.service";
export declare class MailService {
    private userService;
    private jwtservice;
    constructor(userService: UserService, jwtservice: JwtService);
    oAuth2Client: import("google-auth-library").OAuth2Client;
    sendEmail(email: string): Promise<void>;
    decodeConfirmationToken(token: string): Promise<any>;
    confirmEmail(email: string): Promise<void>;
    resendConfirmationLink(id: any): Promise<void>;
}
