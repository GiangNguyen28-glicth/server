import { IsString, Matches } from "class-validator";
export class changePassword{
    oldpassword?:string;
    code?:string;
    @IsString()
    @Matches(/^(?=.*[a-zA-z\d@$!%*#?&.=])(?=.*\d)(?=.*[@$!%*#?&.=])[A-Za-z\d@$!%*#?&.=]{8,}$/, {
        message: '8 Ký tự bao gồm 1 chữ hoa, 1 ký tự đặc biệt',
    })
    password:string;
    passwordConfirm:string;
}
