import { IsNotEmpty, IsString } from "class-validator";

export class confirmEmail{
    @IsString()
    @IsNotEmpty()
    token:string;
}
export enum MailAction{
    LG="LG",
    PW="PW",
    RS="RS",
    MN="MN"
}