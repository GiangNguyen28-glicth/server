import { Model } from "mongoose";
import { PassBookService } from "src/PassBook/PassBook.service";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { CommonService } from "src/Utils/common.service";
import { IReponse } from "src/Utils/IReponse";
import { CartDTO } from "./DTO/Cart.dto";
import { Cart, CartDocument } from "./Schema/Cart.schema";
export declare class CartService {
    private cartmodel;
    private passbookservice;
    private userservice;
    private commonservice;
    constructor(cartmodel: Model<CartDocument>, passbookservice: PassBookService, userservice: UserService, commonservice: CommonService);
    addtoCart(cartdto: CartDTO, user: User): Promise<IReponse<Cart>>;
    dividePassbook(quantity: number, user: User): Promise<IReponse<Cart>>;
}
