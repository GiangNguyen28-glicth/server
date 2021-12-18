import { UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CommonService } from "src/Utils/common.service";
import { User, UserDocument } from "../Schema/User.Schema";
import { JwtPayload } from "./jwt.payload";
import * as moment from 'moment';
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>,private commonservice:CommonService){
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          });
    }
    async validate(payload: JwtPayload): Promise<User> {
        let { id,iat } = payload;
        const date=new Date(Number(iat)*1000);
        date.setHours(date.getHours()+7);
        const user: User = await this.usermodel.findOne({_id:id});
        if (!user) {
          throw new UnauthorizedException();
        }
        if(user.isChangePassword>date){
          console.log("toang");
          throw new UnauthorizedException();
        }
        return user;
    }
    
}