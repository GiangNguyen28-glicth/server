import { IsEmail, IsOptional } from "class-validator";

export class UpdateProfileDTO{
    firstName?:string;
    lastName?:string;
    @IsOptional()
    email?:string;
    CMND?:string;
}