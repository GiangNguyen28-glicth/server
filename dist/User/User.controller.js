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
const role_decorators_1 = require("../decorators/role.decorators");
const role_guard_1 = require("../decorators/role.guard");
const checkout_dto_1 = require("../Paypal/DTO/checkout.dto");
const IReponse_1 = require("../Utils/IReponse");
const ChangePassword_dto_1 = require("./DTO/ChangePassword.dto");
const ConfirmPhone_dto_1 = require("./DTO/ConfirmPhone.dto");
const UpdateProfile_dto_1 = require("./DTO/UpdateProfile.dto");
const user_dto_1 = require("./DTO/user.dto");
const User_Schema_1 = require("./Schema/User.Schema");
const User_service_1 = require("./User.service");
let UserController = class UserController {
    constructor(userservice) {
        this.userservice = userservice;
    }
    async register(userdto) {
        return await this.userservice.register(userdto);
    }
    async signin({ email, password }) {
        return this.userservice.Login({ email, password });
    }
    async updateprofile(updatepfl, user) {
        return this.userservice.updateProfile(updatepfl, user._id);
    }
    async forgotpassword({ email }) {
        return this.userservice.forgotpassword(email);
    }
    async checkVerificationCode(user, confirmPhonedto) {
        return this.userservice.confirmPhoneNumber(confirmPhonedto.code);
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
    async getUser(id) {
        return await this.userservice.getUser(id);
    }
    async getUserbyToken(user) {
        return user;
    }
    async LoginAsAdministrator({ email, password }) {
        return await this.userservice.LoginAsAdministrtor({ email, password });
    }
    async getListUser() {
        return this.userservice.getListUser();
    }
    async getmoneybymonth() {
        return null;
    }
    async getnewuser() {
        return await this.userservice.getnewUser();
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
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotpassword", null);
__decorate([
    (0, common_1.Post)('/check-verification-code'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User, ConfirmPhone_dto_1.ConfirmPhoneDTO]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkVerificationCode", null);
__decorate([
    (0, common_1.Put)('/reset-password'),
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
__decorate([
    (0, common_1.Get)('/getuser/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Get)('/getuserbytoken'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserbyToken", null);
__decorate([
    (0, common_1.Post)('/signinAsadmin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "LoginAsAdministrator", null);
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Get)('/getlistuser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getListUser", null);
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Get)('/getmoneybymonth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getmoneybymonth", null);
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Get)('/getnewuser'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getnewuser", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [User_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=User.controller.js.map