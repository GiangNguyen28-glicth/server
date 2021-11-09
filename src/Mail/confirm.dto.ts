import { IsNotEmpty, IsString } from "class-validator";

export class confirmEmail{
    @IsString()
    @IsNotEmpty()
    token:string;
}