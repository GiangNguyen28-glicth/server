import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PassBook, PassBookSchema } from "src/PassBook/Schema/PassBook.Schema";
import { User, UserSchema } from "src/User/Schema/User.Schema";
import { DashBoardController } from "./dashboard.controller";

@Module({
    imports:[MongooseModule.forFeature([{name:PassBook.name,schema:PassBookSchema}]),
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}])],
    controllers:[DashBoardController],
    providers:[]
})
export class DashBoardModule{

}