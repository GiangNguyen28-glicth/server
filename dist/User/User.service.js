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
const IReponse_1 = require("../Utils/IReponse");
const mongoose = require("mongoose");
const HistoryAction_obj_1 = require("./DTO/HistoryAction.obj");
const checkout_dto_1 = require("../Paypal/DTO/checkout.dto");
const PassBook_service_1 = require("../PassBook/PassBook.service");
const PassBook_Schema_1 = require("../PassBook/Schema/PassBook.Schema");
const common_service_1 = require("../Utils/common.service");
const confirm_dto_1 = require("../Mail/confirm.dto");
let UserService = class UserService {
    constructor(usermodel, otpmodel, connection, passbookservice, mailservice, jwtservice, commonservice) {
        this.usermodel = usermodel;
        this.otpmodel = otpmodel;
        this.connection = connection;
        this.passbookservice = passbookservice;
        this.mailservice = mailservice;
        this.jwtservice = jwtservice;
        this.commonservice = commonservice;
    }
    async register(userdto) {
        const role = user_dto_1.UserRole.USER;
        const { firstName, lastName, password, email, CMND, address, passwordConfirm } = userdto;
        if (CMND.length == 9 || CMND.length == 12) {
            if (!this.checknumber(CMND)) {
                return { code: 500, success: false, message: 'CMND không hợp lệ , CMND là những chữ số' };
            }
        }
        else {
            return { code: 500, success: false, message: 'CMND không hợp lệ CMND chỉ gồm 9 hoặc 12 chữ số' };
        }
        if (!this.checkPhone(userdto.phoneNumber)) {
            return { code: 500, success: false, message: 'Số điện thoại không hợp lệ , số điện thoại gồm 10 chữ số' };
        }
        userdto.role = role;
        if (passwordConfirm != password) {
            return { code: 500, success: false, message: 'Mật khẩu không khớp' };
        }
        const userExistingEmail = await this.usermodel.findOne({ email: email });
        if (userExistingEmail) {
            if (!userExistingEmail.isEmailConfirmed) {
                await this.usermodel.findOneAndDelete({ email: email });
            }
            else {
                return { code: 500, success: false, message: 'Email đã tồn tại' };
            }
        }
        let phoneNumber = '+84' + userdto.phoneNumber.slice(1, userdto.phoneNumber.length);
        const userExistingPhone = await this.usermodel.findOne({
            phoneNumber: phoneNumber,
        });
        if (userExistingPhone) {
            return { code: 500, success: false, message: 'Số điện thoại đã tồn tại' };
        }
        try {
            const date = new Date();
            const salt = await bcrypt.genSalt();
            const hashedpassword = await bcrypt.hash(password, salt);
            const user = this.usermodel.create({
                firstName,
                lastName,
                password: hashedpassword,
                email,
                phoneNumber,
                CMND,
                address,
                role,
                isChangePassword: date,
            });
            await this.mailservice.sendEmail(email, confirm_dto_1.MailAction.PW, '', firstName + lastName);
            (await user).save();
            return {
                code: 200,
                success: true,
                message: 'Đăng ký tài khoản thành công',
                objectreponse: {
                    _id: (await user)._id,
                    phoneNumber,
                    email,
                    CMND,
                    firstName,
                    lastName,
                    address,
                    role,
                },
            };
        }
        catch (err) {
            return {
                code: 500,
                success: false,
                message: `Failed Because ${err.message}`,
            };
        }
    }
    async deleteUser(id) {
        const session = await this.connection.startSession();
        await session.startTransaction();
        try {
            const userExisting = await this.usermodel.findOne({ _id: id });
            if (!userExisting) {
                return { code: 200, success: false, message: 'User not existing' };
            }
        }
        catch (err) {
            session.abortTransaction();
            return { code: 200, success: false, message: err.message };
        }
    }
    async updateProfile(updateprofile, id) {
        const userExisting = await this.usermodel.findOneAndUpdate({ _id: id }, updateprofile);
        if (!userExisting) {
            return { code: 200, success: false, message: 'User không tồn tại' };
        }
        return {
            code: 200,
            success: true,
            message: 'Cập nhật thông tin User thành công !',
        };
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
        if (user &&
            (await bcrypt.compare(password, user.password)) &&
            user.isEmailConfirmed) {
            this.phone = user.phoneNumber;
            const code = await this.randomotp();
            await this.mailservice.sendEmail(email, confirm_dto_1.MailAction.LG, code, user.fullName);
            await this.otpmodel.findOneAndDelete({ phoneNumber: user.phoneNumber });
            const otp = await this.otpmodel.create({
                userId: user._id,
                phoneNumber: user.phoneNumber,
                code: code,
            });
            otp.save();
            return {
                code: 200,
                success: true,
                message: 'Check otp',
            };
        }
        else {
            throw new common_1.UnauthorizedException('Please Check Account');
        }
    }
    async forgotpassword(email) {
        const user = await this.usermodel.findOne({ email: email });
        if (!user) {
            return {
                code: 500,
                success: false,
                message: 'Email không tồn tại !',
            };
        }
        const random = await this.randomotp();
        await this.otpmodel.findOneAndDelete({ phoneNumber: user.phoneNumber });
        const otp = await this.otpmodel.create({
            userId: user._id,
            code: random,
            phoneNumber: user.phoneNumber,
        });
        otp.save();
        await this.mailservice.sendEmail(user.email, confirm_dto_1.MailAction.RS, random, user.fullName);
        return {
            code: 200,
            success: true,
            message: 'Kiểm tra Mail để lấy OTP',
        };
    }
    async confirmPhoneNumber(verificationCode) {
        const otp = await this.otpmodel.findOne({ code: verificationCode });
        if (!otp) {
            return { code: 500, success: false, message: 'OTP đã hết hạn hoặc không tồn tại' };
        }
        if (otp.code != verificationCode) {
            return { code: 500, success: false, message: 'Mã OTP không đúng vui lòng kiểm tra lại' };
        }
        let id = otp.userId;
        const payload = { id };
        const accessToken = await this.jwtservice.sign(payload);
        otp.delete();
        return { accessToken };
    }
    async markPhoneNumberAsConfirmed(userId) {
        return this.otpmodel.findOneAndUpdate({ userId: userId }, {
            isPhoneNumberConfirmed: true,
        });
    }
    async changPassword(changepassword) {
        const date = await this.commonservice.convertDatetime(new Date());
        const { code, password, passwordConfirm } = changepassword;
        const otpexisting = await this.otpmodel.findOne({ code: code });
        if (!otpexisting) {
            return {
                code: 500,
                success: false,
                message: 'Mã OTP đã hết hạn hoặc không tồn tại',
            };
        }
        if (otpexisting.code != code) {
            return { code: 500, success: false, message: 'Mã OTP không đúng' };
        }
        const user = await this.usermodel.findOne({ _id: otpexisting.userId });
        if (!user) {
            return { code: 500, success: false, message: 'User không tồn tại' };
        }
        if (password != passwordConfirm) {
            return { code: 500, success: false, message: 'Mật khâu không khớp !!' };
        }
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(password, salt);
        await this.usermodel.findOneAndUpdate({ _id: otpexisting.userId }, { password: hashedpassword, isChangePassword: date });
        return {
            code: 200,
            success: true,
            message: 'Cập nhật mật khẩu thành công',
        };
    }
    async updateSvd(input, user) {
        const result = await this.usermodel.findByIdAndUpdate({ _id: user._id });
        result.save();
    }
    async updatePassword(changepassword, user) {
        const { oldpassword, password, passwordConfirm } = changepassword;
        if (await bcrypt.compare(oldpassword, user.password)) {
            if (password == passwordConfirm) {
                const date = await this.commonservice.convertDatetime(new Date());
                const salt = await bcrypt.genSalt();
                const hashedpassword = await bcrypt.hash(password, salt);
                await this.usermodel.findOneAndUpdate({ _id: user._id }, { password: hashedpassword, isChangePassword: date });
                return {
                    code: 200,
                    success: true,
                    message: 'Cập nhật mật khẩu thành công',
                };
            }
            else {
                return { code: 500, success: false, message: 'Mật khẩu không khớp' };
            }
        }
        else {
            return { code: 500, success: false, message: 'Mật khẩu cũ không đúng' };
        }
    }
    async updateMoney(action, money, user) {
        let newMoney;
        if (action === HistoryAction_obj_1.Action.OPENPASSBOOK) {
            newMoney = user.currentMoney - money;
        }
        else if (action == HistoryAction_obj_1.Action.NAPTIENPAYPAL ||
            action == HistoryAction_obj_1.Action.NAPTIENATM ||
            action == HistoryAction_obj_1.Action.WITHDRAWAL) {
            newMoney = user.currentMoney + money;
        }
        await this.usermodel.findOneAndUpdate({ _id: user._id }, { currentMoney: newMoney });
    }
    async updateNewAction(historyaction, user) {
        const userExisting = await this.usermodel.findOne({ _id: user._id });
        userExisting.historyaction.push(historyaction);
        userExisting.update();
        userExisting.save();
    }
    async NaptienATM(checkout, user) {
        await this.updateMoney(HistoryAction_obj_1.Action.NAPTIENATM, checkout.vnd, user);
        const historyaction = new HistoryAction_obj_1.HistoryAction();
        historyaction.action = HistoryAction_obj_1.Action.NAPTIENATM;
        historyaction.createAt = new Date();
        historyaction.money = checkout.vnd;
        await this.updateNewAction(historyaction, user);
        const message = `Bạn vừa nạp tiền vào thành công vào tài khoản với số tiền là ${historyaction.money} VND`;
        await this.mailservice.sendEmail(user.email, confirm_dto_1.MailAction.MN, '', user.fullName, message);
        return {
            code: 200,
            success: true,
            message: 'Nạp tiền thành công',
        };
    }
    async getAllTransaction(user) {
        const result = await this.usermodel.findOne({ _id: user._id });
        return result.historyaction;
    }
    async getUser(id) {
        const user = await this.usermodel.findOne({ _id: id });
        if (!user) {
            return {
                code: 500,
                success: false,
                message: 'User not existing',
            };
        }
        return {
            data: {
                firstname: user.firstName,
                lastname: user.lastName,
                fullname: user.fullName,
                money: user.currentMoney,
                address: user.address,
                phonenumnber: user.phoneNumber,
                email: user.email,
            },
        };
    }
    async LoginAsAdministrtor({ email, password }) {
        const user = await this.usermodel.findOne({ email: email });
        if (user &&
            (await bcrypt.compare(password, user.password)) &&
            user.isEmailConfirmed) {
            if (user.role == user_dto_1.UserRole.USER) {
                throw new common_1.UnauthorizedException('Đăng nhập này chỉ dành riêng cho ADMIN');
            }
            let id = user._id;
            const payload = { id };
            const accessToken = await this.jwtservice.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException('Please Check Account');
        }
    }
    async getListUser() {
        return await this.usermodel
            .find({ isEmailConfirmed: true })
            .select('firstName lastName email address currentMoney phoneNumber role')
            .sort({ create: -1, role: -1 });
    }
    async randomotp() {
        let code;
        while (true) {
            code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            const otp = await this.otpmodel.findOne({ code: code });
            if (!otp) {
                break;
            }
        }
        return code;
    }
    async getnewUser() {
        const newuser = await this.usermodel
            .find({ isEmailConfirmed: true, role: user_dto_1.UserRole.USER })
            .sort({ _id: -1 })
            .select('firstName lastName email phoneNumber')
            .limit(10)
            .lean();
        return {
            newuser: newuser,
        };
    }
    async login({ email, password }) {
        const user = await this.usermodel.findOne({ email: email });
        if (user && (await bcrypt.compare(password, user.password))) {
            let id = user._id;
            const payload = { id };
            const accessToken = await this.jwtservice.sign(payload);
            return { accessToken };
        }
        else {
            throw new common_1.UnauthorizedException('Please Check Account');
        }
    }
    async setRole(isAdmin, userId) {
        let role = user_dto_1.UserRole.USER;
        if (isAdmin) {
            role = user_dto_1.UserRole.ADMIN;
        }
        const updateuser = await this.usermodel.findByIdAndUpdate(userId, {
            role: role,
        });
        return {
            code: 200,
            success: true,
            message: 'Cập nhật quyền thành công',
        };
    }
    checknumber(str) {
        let check;
        for (let i = 0; i < str.length; i++) {
            if (str[i] >= '0' && str[i] <= '9') {
                check = true;
            }
            else {
                check = false;
                break;
            }
        }
        return check;
    }
    checkPhone(str) {
        if (str[0] != '0' || str.length != 10) {
            return false;
        }
        if (!this.checknumber(str)) {
            return false;
        }
        return true;
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_Schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(sms_schema_1.OTP.name)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => PassBook_service_1.PassBookService))),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => mail_service_1.MailService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, mongoose.Connection, PassBook_service_1.PassBookService,
        mail_service_1.MailService,
        jwt_1.JwtService,
        common_service_1.CommonService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=User.service.js.map