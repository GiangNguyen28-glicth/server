import { IsString, Matches } from "class-validator";
export class changePassword{
    oldPassword?:string;
    newPassword:string;
    ConfirmPassword:string;
}
