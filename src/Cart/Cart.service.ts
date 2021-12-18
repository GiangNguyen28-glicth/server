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
        const startDate=new Date();
        const endDate=new Date();
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
        if(cartdto.deposits>=1000000&&cartdto.deposits<2000000){
            cartdto.suggest=1;
        }
        else if(cartdto.deposits>=2000000&&cartdto.deposits<3000000){
            cartdto.suggest=2;
        }
        else if(cartdto.deposits>=3000000&&cartdto.deposits<4000000){
            cartdto.suggest=3;
        }
        else{
            cartdto.suggest=4;
        }
        let totalProfit=Number(((cartdto.deposits*(valueofOption/100))*(cartdto.option/12)))+cartdto.deposits; // tong lai suat
        let profit=Number(((cartdto.deposits*(valueofOption/100))*(cartdto.option/12)));//lai suat nhan duoc
        cartdto.depositinpassbook=cartdto.deposits/cartdto.suggest;//so tien moi passbook
        let profitinpassbook=profit/cartdto.suggest;//lai suat nhan duoc trong moi passbook
        endDate.setMonth(endDate.getMonth()+cartdto.option);
        if(cartExisting){
            cartExisting.optionId=passbookexisting._id;
            cartExisting.totalProfit=totalProfit;
            cartExisting.startDate=startDate;
            cartExisting.endDate=endDate;
            cartExisting.option=cartdto.option;
            cartExisting.deposits=cartdto.deposits; //so tien ban dau gui
            cartExisting.profit=profit;
            cartExisting.suggest=cartdto.suggest;
            cartExisting.depositinpassbook=cartdto.depositinpassbook;
            cartExisting.profitinpassbook=profitinpassbook;
            cartExisting.update();
            cartExisting.save();
            return{code:200,success:true,message:"Update cart Success",objectreponse:cartExisting
            }
        }
        const result=await this.cartmodel.create({userId:user._id,option:cartdto.option,optionId:passbookexisting._id,startDate:startDate,
            endDate:endDate,deposits:cartdto.deposits,suggest:cartdto.suggest,totalProfit:totalProfit,profit:profit,
            depositinpassbook:cartdto.depositinpassbook,profitinpassbook:profitinpassbook});
        result.save();
        return{code:200,success:true,message:"Add to cart Success",objectreponse:result
        }
    }

    async newSuggest(quantity:number,user:User):Promise<any>{
        const cartExisting=await this.cartmodel.findOne({userId:user._id});
        if(!cartExisting){
            return{message:"Cart not existing",success:false}
        }
        const deposit=cartExisting.deposits/quantity;
        if(deposit<1000000){
            return{message:"Deposits not ok",success:false}
        }
        const startDate= new Date();
        const endDate=new Date();

        let totalProfit=Number(((cartExisting.deposits*(cartExisting.option/100))*(cartExisting.option/12)))+cartExisting.deposits;
        let profit=Number(((cartExisting.deposits*(cartExisting.option/100))*(cartExisting.option/12)));
        cartExisting.depositinpassbook=cartExisting.deposits/quantity;
        let profitinpassbook=profit/quantity;
        endDate.setMonth(endDate.getMonth()+cartExisting.option);
        if(cartExisting){
            cartExisting.totalProfit=totalProfit;
            cartExisting.endDate=endDate;
            cartExisting.option=cartExisting.option;
            cartExisting.deposits=cartExisting.deposits;
            cartExisting.profit=profit;
            cartExisting.suggest=quantity;
            cartExisting.depositinpassbook=cartExisting.depositinpassbook;
            cartExisting.profitinpassbook=profitinpassbook;
            cartExisting.update();
            cartExisting.save();
            return{code:200,success:true,message:"Update cart Success",objectreponse:cartExisting
            }
        }
        const result=await this.cartmodel.create({userId:user._id,option:cartExisting.option,startDate:startDate,
            endDate:endDate,deposits:cartExisting.deposits,totalProfit:totalProfit,profit:profit});
        result.save();
        return{code:200,success:true,message:"Add to cart Success",objectreponse:result
        }
    }

    async checkoutPassbook(user:User):Promise<any>{
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
        const endDate=new Date();
        endDate.setMonth(endDate.getMonth()+cartExisting.option);
        for(var i=0;i<cartExisting.suggest;i++){
            const svd =new PassBookDTO();
            svd.deposits=cartExisting.depositinpassbook;
            svd.option=cartExisting.option;
            svd.optionId=cartExisting.optionId;
            svd.userId=user._id;
            svd.createAt=new Date();
            await this.passbookservice.saveSavingsdeposit(svd,user);
        }
        const historyaction=new HistoryAction(); 
        historyaction.action=Action.OPENPASSBOOK;
        historyaction.createAt=new Date();
        historyaction.money=cartExisting.depositinpassbook; 
        historyaction.quantity=cartExisting.suggest;   
        await this.userservice.updateNewAction(historyaction,user);
        await this.userservice.updateMoney(Action.OPENPASSBOOK,cartExisting.deposits,user);
        const passpook=await this.passbookservice.GetPassbookIsActive(user);
        cartExisting.delete();
        return{
            data:user.currentMoney-cartExisting.deposits,passbook:passpook
        }
    }
}