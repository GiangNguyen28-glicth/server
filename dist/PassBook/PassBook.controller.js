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
exports.PassBookController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const getuser_decorators_1 = require("../decorators/getuser.decorators");
const role_decorators_1 = require("../decorators/role.decorators");
const role_guard_1 = require("../decorators/role.guard");
const user_dto_1 = require("../User/DTO/user.dto");
const User_Schema_1 = require("../User/Schema/User.Schema");
const IReponse_1 = require("../Utils/IReponse");
const PassBook_dto_1 = require("./DTO/PassBook.dto");
const PassBook_service_1 = require("./PassBook.service");
let PassBookController = class PassBookController {
    constructor(passbookservice) {
        this.passbookservice = passbookservice;
    }
    async saveSavingdeposit(passbookdto, user) {
        passbookdto.userId = user._id;
        return this.passbookservice.saveSavingsdeposit(passbookdto, user);
    }
    async getTotalCycles(passbookid, user) {
        return this.passbookservice.getTotalCycles(passbookid, user);
    }
    async getPassbook(user) {
        return this.passbookservice.GetAllPassbookByUserId(user);
    }
    async getPassbookIsNotActive(user) {
        return this.passbookservice.GetPassbookIsNotActive(user);
    }
    async withdrawMoneyPassbook(user, passbookid) {
        return this.passbookservice.withdrawMoneyPassbook(passbookid, user);
    }
    async getAllPassbook() {
        return await this.passbookservice.getAllPassbook();
    }
    async get() {
        return this.passbookservice.getPassBookByMonth();
    }
};
__decorate([
    (0, common_1.Post)('/save'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PassBook_dto_1.PassBookDTO, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "saveSavingdeposit", null);
__decorate([
    (0, common_1.Get)('/check/:passbookid'),
    __param(0, (0, common_1.Param)('passbookid')),
    __param(1, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "getTotalCycles", null);
__decorate([
    (0, common_1.Get)('/getpassbook'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "getPassbook", null);
__decorate([
    (0, common_1.Get)('/getpassbookisnotactive'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User]),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "getPassbookIsNotActive", null);
__decorate([
    (0, common_1.Post)('/withdrawMoneyPassbook/:passbookid'),
    __param(0, (0, getuser_decorators_1.GetUser)()),
    __param(1, (0, common_1.Param)('passbookid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_Schema_1.User, Object]),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "withdrawMoneyPassbook", null);
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Get)('/getallpassbook'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "getAllPassbook", null);
__decorate([
    (0, common_1.Get)('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PassBookController.prototype, "get", null);
PassBookController = __decorate([
    (0, common_1.Controller)('/passbook'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    __metadata("design:paramtypes", [PassBook_service_1.PassBookService])
], PassBookController);
exports.PassBookController = PassBookController;
//# sourceMappingURL=PassBook.controller.js.map