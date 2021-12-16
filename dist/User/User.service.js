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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_dto_1 = require("./DTO/user.dto");
const User_Schema_1 = require("./Schema/User.Schema");
const bcrypt = require("bcrypt");
const mail_service_1 = require("../Mail/mail.service");
const jwt_1 = require("@nestjs/jwt");
const sms_schema_1 = require("./Schema/sms.schema");
const nestjs_twilio_1 = require("nestjs-twilio");
const twilio_1 = require("twilio");
const IReponse_1 = require("../Utils/IReponse");
const mongoose = require("mongoose");
const HistoryAction_obj_1 = require("./DTO/HistoryAction.obj");
const checkout_dto_1 = require("../Paypal/DTO/checkout.dto");
const PassBook_service_1 = require("../PassBook/PassBook.service");
const PassBook_Schema_1 = require("../PassBook/Schema/PassBook.Schema");
let UserService = class UserService {
    constructor(usermodel, otpmodel, twilioClient, connection, passbookservice, mailservice, jwtservice) {
        this.usermodel = usermodel;
        this.otpmodel = otpmodel;
        this.twilioClient = twilioClient;
        this.connection = connection;
        this.passbookservice = passbookservice;
        this.mailservice = mailservice;
        this.jwtservice = jwtservice;
        this.twilioClient = new twilio_1.Twilio("AC6c195ae195ad3154101bdcb5a6f4a778", process.env.TWL1 + process.env.TWL2);
    }
    async register(userdto) {
        const role = user_dto_1.UserRole.USER;
        let phoneNumber = "+84" + userdto.phoneNumber.slice(1, userdto.phoneNumber.length);
        const { firstName, lastName, password, email, CMND, address, passwordConfirm } = userdto;
        userdto.role = role;
        if (passwordConfirm != password) {
            return { code: 500, success: false, message: "Password not match" };
        }
        const userExisting = await this.usermodel.findOne({ email: email });
        if (userExisting) {
            return { code: 500, success: false, message: "User Existing" };
        }
        try {
            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);
            const user = this.usermodel.create({ firstName, lastName, password: hashedpassword, email, phoneNumber, CMND, address, role });
            await this.mailservice.sendEmail(email);
            (await user).save();
            return {
                code: 200, success: true, message: "Success",
                objectreponse: {
                    _id: (await user)._id, phoneNumber, email, CMND, firstName, lastName, address, role
                }
            };
        }
        catch (err) {
            return { code: 500, success: false, message: `Failed Because ${err.message}` };
        }
    }
    async deleteUser(id) {
        const session = await this.connection.startSession();
        await session.startTransaction();
        try {
            const userExisting = await this.usermodel.findOne({ _id: id });
            if (!userExisting) {
                return { code: 200, success: false, message: "User not existing" };
            }
        }
        catch (err) {
            session.abortTransaction();
            return { code: 200, success: false, message: err.message
            };
        }
    }
    async updateProfile(updateprofile, id) {
        const userExisting = await this.usermodel.findOneAndUpdate({ _id: id }, updateprofile);
        return { code: 200, success: true, message: "Update profile success" };
    }
    async getByEmail(email) {
        return await this.usermodel.findOne({ email: email });
    }
    async markEmailAsConfirmed(email) {
        return this.usermodel.findOneAndUpdate({ email: email }, {
            isExprise: null,
            isEmailConfirmed: true,
        });
    }
    async getByID(id) {
        return this.usermodel.findOne({ _id: id });
    }
    async Login({ email, password }) {
        const user = await this.usermodel.findOne({ email: email });
        if (user && (await bcrypt.compare(password, user.password)) && user.isEmailConfirmed) {
            this.phone = user.phoneNumber;
            await this.sendSMS(user.phoneNumber);
            await this.otpmodel.findOneAndDelete({ phoneNumber: user.phoneNumber });
            const otp = await this.otpmodel.create({ userId: user._id, phoneNumber: user.phoneNumber });
            otp.save();
            return {
                code: 200, success: true, message: "Check otp"
            };
        }
        else {
            throw new common_1.UnauthorizedException('Please Check Account');
        }
    }
    async forgotpassword(phoneNumber) {
        let phonereplace = "+84" + phoneNumber.slice(1, phoneNumber.length);
        const user = await this.usermodel.findOne({ phoneNumber: phonereplace });
        if (!user) {
            throw new common_1.UnauthorizedException('Phone Number not existing');
        }
        await this.otpmodel.findOneAndDelete({ phoneNumber: phonereplace });
        const otp = await this.otpmodel.create({ userId: user._id, phoneNumber: phonereplace });
        otp.save();
        await this.sendSMS(user.phoneNumber);
    }
    async sendSMS(phoneNumber) {
        const serviceSid = "VA034959ee2470c4c29c135bd6a4e9368d";
        this.phone = phoneNumber;
        this.twilioClient.verify.services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: 'sms' });
    }
    async confirmPhoneNumber(verificationCode) {
        const serviceSid = "VA034959ee2470c4c29c135bd6a4e9368d";
        const otp = await this.otpmodel.findOne({ phoneNumber: this.phone });
        const result = await this.twilioClient.verify.services(serviceSid)
            .verificationChecks
            .create({ to: otp.phoneNumber, code: verificationCode });
        if (!result.valid || result.status !== 'approved') {
            throw new common_1.BadRequestException('Wrong code provided');
        }
        let id = otp.userId;
        const payload = { id };
        const accessToken = await this.jwtservice.sign(payload);
        otp.delete();
        return { accessToken };
    }
    async markPhoneNumberAsConfirmed(userId) {
        return this.otpmodel.findOneAndUpdate({ userId: userId }, {
            isPhoneNumberConfirmed: true
        });
    }
    async changPassword(userId, changepassword) {
        const { newPassword, ConfirmPassword } = changepassword;
        const resetPasswordRecord = await this.otpmodel.findOne({ userId: userId });
        if (!resetPasswordRecord && resetPasswordRecord.isPhoneNumberConfirmed) {
            return { code: 400, success: false, message: 'Invalid or expired password reset OTP' };
        }
        if (!resetPasswordRecord.isPhoneNumberConfirmed) {
            return { code: 400, success: false, message: 'OTP ?' };
        }
        const user = await this.usermodel.findOne({ _id: userId });
        if (!user) {
            return { code: 400, success: false, message: 'User no longer exists', };
        }
        if (newPassword != ConfirmPassword) {
            return { code: 400, success: false, message: "password does not match"
            };
        }
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(newPassword, salt);
        await this.usermodel.findOneAndUpdate({ _id: userId }, { password: hashedpassword });
        await resetPasswordRecord.deleteOne();
        return { code: 200, success: true, message: 'User password reset successfully', };
    }
    async updateSvd(input, user) {
        const result = await this.usermodel.findByIdAndUpdate({ _id: user._id });
        result.save();
    }
    async updatePassword(changepassword, user) {
        const { oldPassword, newPassword, ConfirmPassword } = changepassword;
        if ((await bcrypt.compare(oldPassword, user.password))) {
            if (newPassword == ConfirmPassword) {
                const salt = await bcrypt.genSalt();
                const hashedpassword = await bcrypt.hash(newPassword, salt);
                await this.usermodel.findOneAndUpdate({ _id: user._id }, { password: hashedpassword });
                return { code: 200, success: true, message: "Update Password Success" };
            }
            else {
                return { code: 400, success: false, message: "Password not match" };
            }
        }
        else {
            return { code: 400, success: false, message: "Please check old password" };
        }
    }
    async updateMoney(action, money, user) {
        let newMoney;
        if (action === HistoryAction_obj_1.Action.OPENPASSBOOK) {
            newMoney = user.currentMoney - money;
        }
        else if (action == HistoryAction_obj_1.Action.NAPTIENPAYPAL || action == HistoryAction_obj_1.Action.NAPTIENATM || action == HistoryAction_obj_1.Action.WITHDRAWAL) {
            newMoney = user.currentMoney + money;
        }
        const userExisting = await this.usermodel.findOneAndUpdate({ _id: user._id }, { currentMoney: newMoney });
    }
    async updateNewAction(historyaction, user) {
        const userExisting = await this.usermodel.findOne({ _id: user._id });
        userExisting.historyaction.push(historyaction);
        userExisting.update();
        userExisting.save();
    }
    async NaptienATM(checkout, user) {
        await this.updateMoney(HistoryAction_obj_1.Action.NAPTIENATM, checkout.money, user);
        const historyaction = new HistoryAction_obj_1.HistoryAction();
        historyaction.action = HistoryAction_obj_1.Action.NAPTIENATM;
        historyaction.createAt = new Date();
        historyaction.money = checkout.money;
        await this.updateNewAction(historyaction, user);
        return {
            code: 200, success: true, message: "Nap tien thanh cong"
        };
    }
    async getAllTransaction(user) {
        const result = await this.usermodel.findOne({ _id: user._id });
        return result.historyaction;
    }
};
__decorate([
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_dto_1.Checkout, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], UserService.prototype, "NaptienATM", null);
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_Schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(sms_schema_1.OTP.name)),
    __param(2, (0, nestjs_twilio_1.InjectTwilio)()),
    __param(3, (0, mongoose_1.InjectConnection)()),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => PassBook_service_1.PassBookService))),
    __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(() => mail_service_1.MailService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object, mongoose.Connection, PassBook_service_1.PassBookService,
        mail_service_1.MailService,
        jwt_1.JwtService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=User.service.js.map