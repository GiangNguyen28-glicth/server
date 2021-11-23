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
exports.SavingsDepositController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const getuser_decorators_1 = require("../decorators/getuser.decorators");
const User_Schema_1 = require("../User/Schema/User.Schema");
const IReponse_1 = require("../Utils/IReponse");
const SavingsDeposit_dto_1 = require("./DTO/SavingsDeposit.dto");
const SavingsDeposit_service_1 = require("./SavingsDeposit.service");
let SavingsDepositController = class SavingsDepositController {
    constructor(savingsdepositservice) {
        this.savingsdepositservice = savingsdepositservice;
    }
    async saveSavingdeposit(savingsdepositdto, user) {
        savingsdepositdto.userId = user._id;
        return this.savingsdepositservice.saveSavingsdeposit(savingsdepositdto, user);
    }
    async getTotalCycles(id) {
        return this.savingsdepositservice.getTotalCycles(id);
    }
    async getPassbook(user) {
        return this.savingsdepositservice.GetAllPassbookByUserId(user);
    }
    async getPassbookIsActive(user) {
        return this.savingsdepositservice.GetPassbookIsActive(user);
    }
    async GetPassbookById(user, id) {
        return this.savingsdepositservice.GetPassBookById(id, user);
    }
};
__decorate([
    (0, common_1.Post)('/save'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SavingsDeposit_dto_1.SavingsDepositDTO, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], SavingsDepositController.prototype, "saveSavingdeposit", null);
__decorate([
    (0, common_1.Get)('/check/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SavingsDepositController.prototype, "getTotalCycles", null);
__decorate([
    (0, common_1.Get)('/getpassbook'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], SavingsDepositController.prototype, "getPassbook", null);
__decorate([
    (0, common_1.Get)('/getpassbookisactive'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], SavingsDepositController.prototype, "getPassbookIsActive", null);
__decorate([
    (0, common_1.Get)('/getpassbookbyid/:id'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User, Object]),
    __metadata("design:returntype", Promise)
], SavingsDepositController.prototype, "GetPassbookById", null);
SavingsDepositController = __decorate([
    (0, common_1.Controller)('/savingsdeposit'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [SavingsDeposit_service_1.SavingsDepositService])
], SavingsDepositController);
exports.SavingsDepositController = SavingsDepositController;
//# sourceMappingURL=SavingsDeposit.controller.js.map