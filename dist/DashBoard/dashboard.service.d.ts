import { Model } from "mongoose";
import { PassBookDocument } from "src/PassBook/Schema/PassBook.Schema";
import { UserDocument } from "src/User/Schema/User.Schema";
export declare class DashBoardService {
    private usermodel;
    private passbookmodel;
    constructor(usermodel: Model<UserDocument>, passbookmodel: Model<PassBookDocument>);
}
