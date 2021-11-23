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
exports.SavingsDepositService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const CyclesUpdate_service_1 = require("../CyclesUpdate/CyclesUpdate.service");
const CyclesUpdate_dto_1 = require("../CyclesUpdate/DTO/CyclesUpdate.dto");
const CyclesUpdate_schema_1 = require("../CyclesUpdate/Schema/CyclesUpdate.schema");
const Option_service_1 = require("../Option/Option.service");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
const IReponse_1 = require("../Utils/IReponse");
const SavingsDeposit_Schema_1 = require("./Schema/SavingsDeposit.Schema");
let SavingsDepositService = class SavingsDepositService {
    constructor(savingsdepositmodel, connection, userservice, cyclesupdateservice, optionservice) {
        this.savingsdepositmodel = savingsdepositmodel;
        this.connection = connection;
        this.userservice = userservice;
        this.cyclesupdateservice = cyclesupdateservice;
        this.optionservice = optionservice;
    }
    async saveSavingsdeposit(savingsdeposit, user) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const svdp = await this.savingsdepositmodel.create(savingsdeposit);
            svdp.save();
            await this.userservice.updateSvd(svdp, user);
            return {
                code: 200,
                success: true,
                message: "Succes",
            };
        }
        catch (err) {
            session.abortTransaction();
            return {
                code: 500,
                success: false,
                message: err.message
            };
        }
    }
    async getTotalCycles(svdid) {
        var endDate = new Date();
        let value;
        let arr = [];
        const svd = await this.savingsdepositmodel.findOne({ _id: svdid });
        const startDate = new Date(`${svd.createAt}`);
        let temp = [];
        while (startDate <= endDate) {
            temp.push(new Date(startDate));
            startDate.setMonth(startDate.getMonth() + svd.option);
            console.log(startDate);
            value = await this.optionservice.GetValueOption(startDate, svd.option);
            console.log(value);
            arr.push(value);
        }
        console.log(arr);
        let money = svd.deposits;
        for (let i = 0; i < arr.length - 1; i++) {
            money = ((money * (arr[i] / 100)) * svd.option / 12) + money;
            console.log(money);
        }
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const date = diffDays(endDate, temp[temp.length - 1]);
        console.log(date);
        money = money + money * 0.0001 * (date - 1) / 360;
        console.log("total:" + money);
        return null;
    }
    async GetAllPassbookByUserId(user) {
        const passbook = await this.savingsdepositmodel.find({ userId: user._id });
        console.log(passbook);
    }
    async GetPassbookIsActive(user) {
        const passbook = await this.savingsdepositmodel.find({ userId: user._id, status: false });
    }
    async GetPassBookById(id, user) {
        return this.savingsdepositmodel.findOne({ userId: user._id, _id: id });
    }
};
SavingsDepositService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(SavingsDeposit_Schema_1.SavingsDeposit.name)),
    __param(1, (0, mongoose_1.InjectConnection)()),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => User_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose.Model, mongoose.Connection, User_service_1.UserService,
        CyclesUpdate_service_1.CyclesUpdateService,
        Option_service_1.OptionService])
], SavingsDepositService);
exports.SavingsDepositService = SavingsDepositService;
//# sourceMappingURL=SavingsDeposit.service.js.map