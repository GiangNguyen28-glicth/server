import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SavingsDepositDTO } from "src/SavingsDeposit/DTO/SavingsDeposit.dto";
import { SavingsDepositService } from "src/SavingsDeposit/SavingsDeposit.service";
import { Action, HistoryAction } from "src/User/DTO/HistoryAction.obj";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { IReponse } from "src/Utils/IReponse";
import { CartDTO } from "./DTO/Cart.dto";
import { Cart, CartDocument } from "./Schema/Cart.schema";

@Injectable()
export class CartService{
    constructor(@InjectModel(Cart.name) private cartmodel:Model<CartDocument>,
    private svdservice:SavingsDepositService,
    private userservice:UserService){}
    
    async addtoCart(cartdto:CartDTO,user:User):Promise<IReponse<Cart>>{
        const startDate=new Date();
        const endDate=new Date();
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        if(cartExisting){
            cartExisting.delete();
        }
        let totalProfit=Number(((cartdto.deposits*(cartdto.option/100))*(cartdto.option/12)));
        totalProfit=totalProfit+cartdto.deposits;
        endDate.setMonth(endDate.getMonth()+cartdto.option);
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

    async checkout(user:User):Promise<IReponse<Cart>>{
        const cart=await this.cartmodel.findOne({userId:user._id});
        if(!cart){
            return{
                code:400,success:false,message:"Cart not exist"
            }
        }
        if(user.currentMoney<cart.deposits){
            return{
                code:400,success:false,message:"Not enough money in the account"
            }
        }
        const svd =new SavingsDepositDTO();
        svd.deposits=cart.deposits;
        svd.option=cart.option;
        svd.userId=user._id;
        await this.svdservice.saveSavingsdeposit(svd,user);
        const historyaction=new HistoryAction();
        historyaction.action=Action.OPENPASSBOOK;
        historyaction.createAt=new Date();
        await this.userservice.updateMoney(historyaction.action,cart.deposits,user);
        await this.userservice.updateNewAction(historyaction,user);
        cart.delete();
        return{
            code:200,success:true,message:"Checkout success"
        }
    }

    async dividePassbook(quantity:number,user:User):Promise<IReponse<Cart>>{
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        const money=cartExisting.deposits/quantity;
        if(money<100){
            return{
                code:500,success:false,message:"Not enough money in the account"
            }
        }
        for(var i=0;i<quantity;i++){
            const svd =new SavingsDepositDTO();
            svd.deposits=money;
            svd.option=cartExisting.option;
            svd.userId=user._id;
            await this.svdservice.saveSavingsdeposit(svd,user);
            const historyaction=new HistoryAction();
            historyaction.action=Action.OPENPASSBOOK;
            historyaction.createAt=new Date();
            await this.userservice.updateMoney(historyaction.action,money,user);
            await this.userservice.updateNewAction(historyaction,user);
        }
        cartExisting.delete();
    }
}