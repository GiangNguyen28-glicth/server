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
exports.SavingsDepositSchema = exports.SavingsDeposit = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const mongoose = require("mongoose");
const User_Schema_1 = require("../../User/Schema/User.Schema");
const CyclesUpdate_schema_1 = require("../../CyclesUpdate/Schema/CyclesUpdate.schema");
let SavingsDeposit = class SavingsDeposit {
};
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", Object)
], SavingsDeposit.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SavingsDeposit.prototype, "deposits", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SavingsDeposit.prototype, "option", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Object)
], SavingsDeposit.prototype, "createAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SavingsDeposit.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }),
    (0, class_transformer_1.Type)(() => User_Schema_1.User),
    __metadata("design:type", Object)
], SavingsDeposit.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    (0, class_transformer_1.Type)(() => CyclesUpdate_schema_1.CyclesUpdate),
    __metadata("design:type", Array)
], SavingsDeposit.prototype, "cyclesupdate", void 0);
SavingsDeposit = __decorate([
    (0, mongoose_1.Schema)()
], SavingsDeposit);
exports.SavingsDeposit = SavingsDeposit;
exports.SavingsDepositSchema = mongoose_1.SchemaFactory.createForClass(SavingsDeposit);
//# sourceMappingURL=SavingsDeposit.Schema.js.map