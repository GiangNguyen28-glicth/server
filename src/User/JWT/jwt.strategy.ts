import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CommonService } from "src/Utils/common.service";
import { User, UserDocument } from "../Schema/User.Schema";
import { JwtPayload } from "./jwt.payload";
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>,private commonservice:CommonService){
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          });
    }
    async validate(payload: JwtPayload): Promise<User> {
        let { id,iat } = payload;
        let date =new Date(Number(iat)*1000);
        console.log(date);
        const user: User = await this.usermodel.findOne({_id:id});
        console.log(user.isChangePassword);
        if (!user) {
          console.log(1);
          throw new UnauthorizedException();
        }
        // if(user.isChangePassword>date){
        //   console.log(2);
        //   throw new UnauthorizedException();
        // }
        return user;
    }
    
}