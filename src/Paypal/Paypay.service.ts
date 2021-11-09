import { Injectable } from "@nestjs/common";
import * as paypal from "paypal-rest-sdk"
@Injectable()
export class PaypalService{
    async Pay(response,id){
        let product=[
          {
             "name": "6177744acb4a49150a63fc1a",
             "sku": "5asdasdas5555",
            "price": "1.20",
            "currency": "USD",
            "quantity": 1,
            // "_id": "6177744acb4a49150a63fc1a",
            // "categories": "6146fa725a0ef299a84efccc",
          },
          {
            "name": "6177744acb4a49150a63fcsss",
            "sku": "5asdsada55",
            "price": "2.10",
            "currency": "USD",
            "quantity": 1,
            // "_id": "6177744acb4a49150a63fc1a",
            // "categories": "6146fa725a0ef299a84efccc",
          }
        ];
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
                "item_list": {
                    "items":product
                    // [{"name":"Red Sox Hat","sku":"001","price":"1.20","currency":"USD","quantity":1}
                    // ,{"name":"Red Sox Hat","sku":"001","price":"1.20","currency":"USD","quantity":1}]
                },
                "amount": {
                    "currency": "USD",
                    "total": "2.40"
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
                console.log("XABCASAD");
                console.log(error.message)
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
                "total":"2.40"
            }
        }]
        };
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            response.send('Success');
        }
        });
    }   
}