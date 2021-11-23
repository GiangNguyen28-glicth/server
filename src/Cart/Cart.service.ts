import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PassBookDTO } from "src/PassBook/DTO/PassBook.dto";
import { PassBookService } from "src/PassBook/PassBook.service";
import { Action, HistoryAction } from "src/User/DTO/HistoryAction.obj";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { IReponse } from "src/Utils/IReponse";
import { CartDTO } from "./DTO/Cart.dto";
import { Cart, CartDocument } from "./Schema/Cart.schema";

@Injectable()
export class CartService{
    constructor(@InjectModel(Cart.name) private cartmodel:Model<CartDocument>,
    private passbookservice:PassBookService,
    private userservice:UserService){}
    
    async addtoCart(cartdto:CartDTO,user:User):Promise<IReponse<Cart>>{
        const startDate=new Date();
        const endDate=new Date();
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        let totalProfit=Number(((cartdto.deposits*(cartdto.option/100))*(cartdto.option/12)))+cartdto.deposits;
        endDate.setMonth(endDate.getMonth()+cartdto.option);
        if(cartdto.deposits>user.currentMoney){
            return{
                code:500,
                success:false,
                message:"Money not enough",
            }
        }
        if(cartExisting){
            cartExisting.totalProfit=totalProfit;
            cartExisting.endDate=endDate;
            cartExisting.option=cartdto.option;
            cartExisting.deposits=cartdto.deposits;
            cartExisting.update();
            cartExisting.save();
            return{
                code:200,
                success:true,
                message:"Update cart Success",
                objectreponse:cartExisting
            }
        }
        const result=await this.cartmodel.create({userId:user._id,option:cartdto.option,
            endDate:endDate,deposits:cartdto.deposits,totalProfit:totalProfit});
        result.save();
        return{
            code:200,
            success:true,
            message:"Add to cart Success",
            objectreponse:result
        }
    }

    async dividePassbook(quantity:number,user:User):Promise<IReponse<Cart>>{
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        if(!cartExisting){
            return{
                code:400,success:false,message:"Cart not exist"
            }
        }
        if(user.currentMoney<cartExisting.deposits){
            return{
                code:400,success:false,message:"Not enough money in the account"
            }
        }
        const money=cartExisting.deposits/quantity;
        if(money<100){
            return{
                code:500,success:false,message:"Not enough money in the account"
            }
        }
        for(var i=0;i<quantity;i++){
            const svd =new PassBookDTO();
            svd.deposits=money;
            svd.option=cartExisting.option;
            svd.userId=user._id;
            await this.passbookservice.saveSavingsdeposit(svd,user);
            const historyaction=new HistoryAction();
            historyaction.action=Action.OPENPASSBOOK;
            historyaction.createAt=new Date();
            historyaction.money=money;
            await this.userservice.updateMoney(historyaction.action,money,user);
            await this.userservice.updateNewAction(historyaction,user);
        }
        cartExisting.delete();
    }
}