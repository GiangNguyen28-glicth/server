import { Injectable } from "@nestjs/common";
import * as paypal from "paypal-rest-sdk"
import { Action, HistoryAction } from "src/User/DTO/HistoryAction.obj";
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
import { CommonService } from "src/Utils/common.service";
@Injectable()
export class PaypalService{
    constructor(private userservice:UserService,
        private commonservice:CommonService){}
    total=0;
    usercheckout:User;
    async Payment(response,money:number,user:User){       
        this.usercheckout=user;
        this.total=money;
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://server-one-kappa.vercel.app/paypal/success",
                "cancel_url": "https://server-one-kappa.vercel.app/paypal/cancel"
            },
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": `${money}`
                },
                "description": "Hat for the best team ever"
            }]
        };
        paypal.configure({
            'mode': 'sandbox', //sandbox or live
            'client_id': process.env.PAYPAL_CLIENT_ID,
            'client_secret': process.env.PAYPAL_CLIENT_SECRET
            });
            paypal.payment.create(create_payment_json,function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i = 0;i < payment.links.length;i++){
                    if(payment.links[i].rel === 'approval_url'){
                        response.redirect(payment.links[i].href);
                        console.log(payment.links[i].href);
                    }
                }
            }
        });   
    }

    async Success(response,request){
        const payerId = request.query.PayerID;
        const paymentId = request.query.paymentId;
        if(this.usercheckout==undefined){
            console.log(1);
            console.log(this.usercheckout);
            response.send('Failed');
            return;
        }
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total":`${this.total}`
                }
            }]
        };
        let moneyconvert=this.convertmoney(this.total);
        console.log(moneyconvert);
        await this.userservice.updateMoney(Action.NAPTIENPAYPAL,await moneyconvert,this.usercheckout);
        const historyaction=new HistoryAction();
        historyaction.action=Action.NAPTIENPAYPAL;
        historyaction.createAt=new Date();
        historyaction.money=this.total;
        await this.userservice.updateNewAction(historyaction,this.usercheckout);
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                response.send('Success');
            }
        });
    }

    async convertmoney(usdinput:number):Promise<number>{
        const {vnd,usd}=await this.commonservice.convertMoney();
        const value=usdinput*vnd/usd;
        return value;
    }
}