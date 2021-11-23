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
    @Matches(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, {
        message: 'Phone Incorrect',
    })
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