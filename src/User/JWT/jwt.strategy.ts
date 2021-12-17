import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from "../Schema/User.Schema";
import { JwtPayload } from "./jwt.payload";
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>){
        super({
            secretOrKey: 'topSecret51',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          });
    }
    async validate(payload: JwtPayload,ctx: ExecutionContext): Promise<User> {
        const { id } = payload;
        // const req = ctx.switchToHttp().getRequest();
        // console.log(req.headers.authorization.split(" ")[1]);
        const user: User = await this.usermodel.findOne({_id:id});
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
    }
    
}