import { IReponse } from "src/utils/IReponse";
import { User } from "./Schema/User.Schema";
export class UserReponse implements IReponse{
    code:number;
    success:boolean;
    message?:string;
    user?:User;
}