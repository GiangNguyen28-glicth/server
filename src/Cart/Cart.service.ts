import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OptionService } from "src/Option/Option.service";
import { PassBookDTO } from "src/PassBook/DTO/PassBook.dto";
import { PassBookService } from "src/PassBook/PassBook.service";
import { Action, HistoryAction } from "src/User/DTO/HistoryAction.obj";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { CommonService } from "src/Utils/common.service";
import { IReponse } from "src/Utils/IReponse";
import { CartDTO } from "./DTO/Cart.dto";
import { Cart, CartDocument } from "./Schema/Cart.schema";

@Injectable()
export class CartService{
    constructor(@InjectModel(Cart.name) private cartmodel:Model<CartDocument>,
    private passbookservice:PassBookService,
    private userservice:UserService,
    private commonservice:CommonService,
    private optionservice:OptionService){}
    
    async addtoCart(cartdto:CartDTO,user:User):Promise<any>{
        const startDate=this.commonservice.convertDatetime(new Date());
        const endDate=this.commonservice.convertDatetime(new Date());
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        const passbookexisting=await this.optionservice.findOption(cartdto.option);
        const valueofOption=await this.optionservice.GetValueOption(startDate,cartdto.option);
        if(!passbookexisting){
            return{code:500,success:false,message:"Option not exist"}
        }
        if(cartdto.deposits<1000000){
            return{code:500,success:false,message:"At least 1.000.000"}
        }
        if(cartdto.deposits>user.currentMoney){
            const tienthieu=cartdto.deposits-user.currentMoney;
            return{
                code:500,success:false,message:`Not enough money in the account, You need ${tienthieu} VND`,money:tienthieu
            }
        }
        let totalProfit=Number(((cartdto.deposits*(valueofOption/100))*(cartdto.option/12)))+cartdto.deposits;
        endDate.setMonth(endDate.getMonth()+cartdto.option);
        if(cartExisting){
            cartExisting.optionId=passbookexisting._id;
            cartExisting.totalProfit=totalProfit;
            cartExisting.endDate=endDate;
            cartExisting.option=cartdto.option;
            cartExisting.deposits=cartdto.deposits;
            cartExisting.update();
            cartExisting.save();
            return{code:200,success:true,message:"Update cart Success",objectreponse:cartExisting
            }
        }
        const result=await this.cartmodel.create({userId:user._id,option:cartdto.option,startDate:startDate,
            endDate:endDate,deposits:cartdto.deposits,totalProfit:totalProfit});
        result.save();
        return{code:200,success:true,message:"Add to cart Success",objectreponse:result
        }
    }

    async dividePassbook(quantity:number,user:User):Promise<any>{
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        if(!cartExisting){
            return{
                code:400,success:false,message:"Cart not exist"
            }
        }
        if(user.currentMoney<cartExisting.deposits){
            const tienthieu=cartExisting.deposits-user.currentMoney;
            return{
                code:400,success:false,message:`Not enough money in the account, You need ${tienthieu} VND`,money:tienthieu
            }
        }
        const money=cartExisting.deposits/quantity;
        if(money<1000000){
            const tienthieu=1000000-money;
            return{
                code:500,success:false,message:`Not enough money in the account,at least 1.000.000 in each passsbook,You need ${tienthieu*quantity} VND`,money:tienthieu*quantity
            }
        }
        for(var i=0;i<quantity;i++){
            const svd =new PassBookDTO();
            svd.deposits=money;
            svd.option=cartExisting.option;
            svd.optionId=cartExisting.optionId;
            svd.userId=user._id;
            svd.createAt=this.commonservice.convertDatetime(new Date());
            await this.passbookservice.saveSavingsdeposit(svd,user);
            const historyaction=new HistoryAction();
            historyaction.action=Action.OPENPASSBOOK;
            historyaction.createAt=await this.commonservice.convertDatetime(new Date());
            historyaction.money=money;
            await this.userservice.updateMoney(historyaction.action,money,user);
            await this.userservice.updateNewAction(historyaction,user);
        }
        cartExisting.delete();
    }
}