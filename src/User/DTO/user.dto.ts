import { IsEmail, IsOptional, IsString, Matches } from "class-validator";

export class UserDTO{
    @IsString()
    firstName:string;
    @IsString()
    lastName:string;
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: '8 characters including 1 uppercase letter, 1 special character',
    })
    password:string;
    @IsString()
    phoneNumber:string;
    @IsEmail()
    email:string;
    CMND:string;
    @IsOptional()
    role?:UserRole
}
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}