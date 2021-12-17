import { User } from "src/User/Schema/User.Schema";
import { CartService } from "./Cart.service";
import { CartDTO } from "./DTO/Cart.dto";
export declare class CartController {
    private cartservice;
    constructor(cartservice: CartService);
    addtoCart(cartdto: CartDTO, user: User): Promise<any>;
    dividePassbook(user: User): Promise<any>;
    newSuggest(quantity: any, user: User): Promise<any>;
}
