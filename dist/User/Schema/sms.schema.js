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
exports.OTPSchema = exports.OTP = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const mongoose = require("mongoose");
const User_Schema_1 = require("./User.Schema");
let OTP = class OTP {
};
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", Object)
], OTP.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OTP.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'User' }),
    (0, class_transformer_1.Type)(() => User_Schema_1.User),
    __metadata("design:type", Object)
], OTP.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], OTP.prototype, "isPhoneNumberConfirmed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now, expires: 60 * 60 * 5 }),
    __metadata("design:type", Date)
], OTP.prototype, "isVerifyOtp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], OTP.prototype, "code", void 0);
OTP = __decorate([
    (0, mongoose_1.Schema)()
], OTP);
exports.OTP = OTP;
exports.OTPSchema = mongoose_1.SchemaFactory.createForClass(OTP);
//# sourceMappingURL=sms.schema.js.map