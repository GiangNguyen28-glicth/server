import { IsEmail, IsOptional } from "class-validator";

export class UpdateProfileDTO{
    firstName?:string;
    lastName?:string;
    email?:string;
    CMND?:string;
}