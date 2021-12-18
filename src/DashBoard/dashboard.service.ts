import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PassBook, PassBookDocument } from "src/PassBook/Schema/PassBook.Schema";
import { User, UserDocument } from "src/User/Schema/User.Schema";

@Injectable()
export class DashBoardService{
    constructor(@InjectModel(User.name) private usermodel:Model<UserDocument>,
    @InjectModel(PassBook.name) private passbookmodel:Model<PassBookDocument>){}
}