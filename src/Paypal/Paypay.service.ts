import { Injectable } from "@nestjs/common";
import * as paypal from "paypal-rest-sdk"
import { User } from "src/User/Schema/User.Schema";
import { UserService } from "src/User/User.service";
@Injectable()
export class PaypalService{
    constructor(private userservice:UserService){}
    total=0;
    async Payment(response,money:number){
        this.total=money;
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/paypal/success",
                "cancel_url": "http://localhost:3000/cancel"
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
                    }
                }
            }
        });   
    }

    async Success(response,request){
        const payerId = request.query.PayerID;
        const paymentId = request.query.paymentId;
        // console.log(this.total.toString());
        const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total":`${this.total}`
            }
        }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            response.send('Success');
        }
        });
    }
    
    async naptienpaypal(money:number,user:User){
        
    }
}