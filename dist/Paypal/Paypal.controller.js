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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalController = void 0;
const common_1 = require("@nestjs/common");
const Paypay_service_1 = require("./Paypay.service");
const checkout_dto_1 = require("./DTO/checkout.dto");
const passport_1 = require("@nestjs/passport");
const getuser_decorators_1 = require("../decorators/getuser.decorators");
const User_Schema_1 = require("../User/Schema/User.Schema");
const common_service_1 = require("../Utils/common.service");
let PaypalController = class PaypalController {
    constructor(paypalservice, commonservice) {
        this.paypalservice = paypalservice;
        this.commonservice = commonservice;
    }
    PayPal(response, checkout, user) {
        console.log(checkout.money);
        return this.paypalservice.Payment(response, checkout.money, user);
    }
    Home() {
    }
    Success(response, request) {
        return this.paypalservice.Success(response, request);
    }
    Test() {
        return this.paypalservice.convertmoney(2);
    }
    Cancel(response, request) {
        return "Cancel";
    }
    async getMoney() {
        return await this.paypalservice.convertmoney(Number(1));
    }
};
__decorate([
    (0, common_1.Post)('/checkout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, checkout_dto_1.Checkout, User_Schema_1.User]),
    __metadata("design:returntype", void 0)
], PaypalController.prototype, "PayPal", null);
__decorate([
    (0, common_1.Get)('/'),
    (0, common_1.Render)('index'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaypalController.prototype, "Home", null);
__decorate([
    (0, common_1.Get)('/success'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaypalController.prototype, "Success", null);
__decorate([
    (0, common_1.Get)('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaypalController.prototype, "Test", null);
__decorate([
    (0, common_1.Get)('/cancel'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PaypalController.prototype, "Cancel", null);
__decorate([
    (0, common_1.Get)('/getmoney'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaypalController.prototype, "getMoney", null);
PaypalController = __decorate([
    (0, common_1.Controller)('/paypal'),
    __metadata("design:paramtypes", [Paypay_service_1.PaypalService, common_service_1.CommonService])
], PaypalController);
exports.PaypalController = PaypalController;
//# sourceMappingURL=Paypal.controller.js.map