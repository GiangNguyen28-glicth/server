
import { IsEmail, IsOptional, IsString, Matches } from "class-validator";
export class UserDTO{
    @IsString()
    firstName:string;
    @IsString()
    lastName:string;
    @IsString()
    @Matches(/^(?=.*[a-zA-z\d@$!%*#?&.=])(?=.*\d)(?=.*[@$!%*#?&.=])[A-Za-z\d@$!%*#?&.=]{8,}$/, {
        message: '8 characters including 1 uppercase letter, 1 special character',
    })
    password:string;
    passwordConfirm:String;
    @IsString()
    phoneNumber:string;
    @IsEmail()
    email:string;
    CMND:string;
    address:string;
    @IsOptional()
    role?:UserRole
}
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}