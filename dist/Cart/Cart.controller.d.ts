import { User } from "src/User/Schema/User.Schema";
import { IReponse } from "src/Utils/IReponse";
import { CartService } from "./Cart.service";
import { CartDTO } from "./DTO/Cart.dto";
import { Cart } from "./Schema/Cart.schema";
export declare class CartController {
    private cartservice;
    constructor(cartservice: CartService);
    addtoCart(cartdto: CartDTO, user: User): Promise<IReponse<Cart>>;
    dividePassbook(user: User, quantity: number): Promise<IReponse<Cart>>;
}
