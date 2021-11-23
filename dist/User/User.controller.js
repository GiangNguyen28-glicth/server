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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const getuser_decorators_1 = require("../decorators/getuser.decorators");
const checkout_dto_1 = require("../Paypal/DTO/checkout.dto");
const IReponse_1 = require("../Utils/IReponse");
const cache_user_key_dto_1 = require("./DTO/cache.user.key.dto");
const ChangePassword_dto_1 = require("./DTO/ChangePassword.dto");
const ConfirmPhone_dto_1 = require("./DTO/ConfirmPhone.dto");
const phoneNumber_dto_1 = require("./DTO/phoneNumber.dto");
const UpdateProfile_dto_1 = require("./DTO/UpdateProfile.dto");
const user_dto_1 = require("./DTO/user.dto");
const User_Schema_1 = require("./Schema/User.Schema");
const User_service_1 = require("./User.service");
let UserController = class UserController {
    constructor(userservice) {
        this.userservice = userservice;
    }
    async register(userdto) {
        return this.userservice.register(userdto);
    }
    async signin({ email, password }) {
        return this.userservice.Login({ email, password });
    }
    async updateprofile(updatepfl, user) {
        return this.userservice.updateProfile(updatepfl, user._id);
    }
    async forgotpassword(phoneNumber) {
        return this.userservice.forgotpassword(phoneNumber.phoneNumber);
    }
    async checkVerificationCode(user, confirmPhonedto) {
        return this.userservice.confirmPhoneNumber(user._id, user.phoneNumber, confirmPhonedto.code);
    }
    async changePassword(user, changepassword) {
        return this.userservice.changPassword(user._id, changepassword);
    }
    async updatePassword(changepassword, user) {
        return this.userservice.updatePassword(changepassword, user);
    }
    async Addmoney(checkout, user) {
        return this.userservice.NaptienATM(checkout, user);
    }
    async GetAllTransaction(user) {
        return this.userservice.getAllTransaction(user);
    }
};
__decorate([
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UserDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/signin'),
    (0, common_1.UseInterceptors)(common_1.CacheInterceptor),
    (0, common_1.CacheKey)(cache_user_key_dto_1.CacheKeyUser.GET_CACHE_KEY_USER),
    (0, common_1.CacheTTL)(1220),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signin", null);
__decorate([
    (0, common_1.Put)('/updateprofile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateProfile_dto_1.UpdateProfileDTO, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateprofile", null);
__decorate([
    (0, common_1.Post)('/forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [phoneNumber_dto_1.PhoneNumberDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotpassword", null);
__decorate([
    (0, common_1.Post)('/check-verification-code'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User, ConfirmPhone_dto_1.ConfirmPhoneDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkVerificationCode", null);
__decorate([
    (0, common_1.Post)('/change-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User, ChangePassword_dto_1.changePassword]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Put)('/update-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangePassword_dto_1.changePassword, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('/addmoney'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_dto_1.Checkout, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "Addmoney", null);
__decorate([
    (0, common_1.Get)('/getalltransaction'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "GetAllTransaction", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [User_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=User.controller.js.map