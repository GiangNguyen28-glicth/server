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
        let date =await this.commonservice.convertDatetime(new Date(Number(iat)*1000))
        const user: User = await this.usermodel.findOne({_id:id});
        if(user.isChangePassword>date){
          throw new UnauthorizedException();
        }
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
    }
    
}