"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalService = void 0;
const common_1 = require("@nestjs/common");
const paypal = require("paypal-rest-sdk");
const HistoryAction_obj_1 = require("../User/DTO/HistoryAction.obj");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
let PaypalService = class PaypalService {
    constructor(userservice) {
        this.userservice = userservice;
        this.total = 0;
    }
    async Payment(response, money, user) {
        this.usercheckout = user;
        this.total = money;
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
            'mode': 'sandbox',
            'client_id': process.env.PAYPAL_CLIENT_ID,
            'client_secret': process.env.PAYPAL_CLIENT_SECRET
        });
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            }
            else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        response.redirect(payment.links[i].href);
                        console.log(payment.links[i].href);
                    }
                }
            }
        });
    }
    async Success(response, request) {
        const payerId = request.query.PayerID;
        const paymentId = request.query.paymentId;
        if (this.usercheckout == undefined) {
            response.send('Failed');
            return;
        }
        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                    "amount": {
                        "currency": "USD",
                        "total": `${this.total}`
                    }
                }]
        };
        await this.userservice.updateMoney(HistoryAction_obj_1.Action.NAPTIENPAYPAL, this.total, this.usercheckout);
        const historyaction = new HistoryAction_obj_1.HistoryAction();
        historyaction.action = HistoryAction_obj_1.Action.NAPTIENPAYPAL;
        historyaction.createAt = new Date();
        historyaction.money = this.total;
        await this.userservice.updateNewAction(historyaction, this.usercheckout);
        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                throw error;
            }
            else {
                response.send('Success');
            }
        });
    }
};
PaypalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [User_service_1.UserService])
], PaypalService);
exports.PaypalService = PaypalService;
//# sourceMappingURL=Paypay.service.js.map