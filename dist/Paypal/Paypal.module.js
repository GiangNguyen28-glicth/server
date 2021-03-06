"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalModule = void 0;
const common_1 = require("@nestjs/common");
const User_module_1 = require("../User/User.module");
const common_service_1 = require("../Utils/common.service");
const Paypal_controller_1 = require("./Paypal.controller");
const Paypay_service_1 = require("./Paypay.service");
let PaypalModule = class PaypalModule {
};
PaypalModule = __decorate([
    (0, common_1.Module)({
        imports: [User_module_1.UserModule],
        controllers: [Paypal_controller_1.PaypalController],
        providers: [Paypay_service_1.PaypalService, common_service_1.CommonService],
    })
], PaypalModule);
exports.PaypalModule = PaypalModule;
//# sourceMappingURL=Paypal.module.js.map