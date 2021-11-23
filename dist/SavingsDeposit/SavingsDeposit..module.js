"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsDepositModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const SavingsDeposit__service_1 = require("./SavingsDeposit..service");
const SavingsDeposit_controller_1 = require("./SavingsDeposit.controller");
const SavingsDeposit_Schema_1 = require("./Schema/SavingsDeposit.Schema");
let SavingsDepositModule = class SavingsDepositModule {
};
SavingsDepositModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: SavingsDeposit_Schema_1.SavingsDeposit.name, schema: SavingsDeposit_Schema_1.SavingsDepositSchema }])],
        controllers: [SavingsDeposit_controller_1.SavingsDepositController],
        providers: [SavingsDeposit__service_1.SavingsDepositService]
    })
], SavingsDepositModule);
exports.SavingsDepositModule = SavingsDepositModule;
//# sourceMappingURL=SavingsDeposit..module.js.map