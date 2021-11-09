import { IsString, Matches } from "class-validator";
import { ObjectId } from "mongoose";
export class changePassword{
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: '8 characters including 1 uppercase letter, 1 special character',
    })
    newPassword:string;
    ConfirmPassword:string;
}
