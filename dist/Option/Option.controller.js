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
exports.OptionController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_decorators_1 = require("../decorators/role.decorators");
const role_guard_1 = require("../decorators/role.guard");
const user_dto_1 = require("../User/DTO/user.dto");
const newOption_dto_1 = require("./DTO/newOption.dto");
const Option_dto_1 = require("./DTO/Option.dto");
const Option_service_1 = require("./Option.service");
let OptionController = class OptionController {
    constructor(optionService) {
        this.optionService = optionService;
    }
    async saveOption(optiondto) {
        return this.optionService.saveoption(optiondto);
    }
    async findAllOption() {
        return this.optionService.findAllOption();
    }
    async updateOption(id, newoptiondto) {
        return this.optionService.updatenewOption(id, newoptiondto);
    }
    async GetValueOption(option) {
        let date = new Date();
        return await this.optionService.GetValueOption(date, option.option);
    }
    async GetCurrentOptionValue(Year) {
        const temp = Number(Year);
        return this.optionService.GetValueByYear(temp);
    }
};
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Post)('/saveOption'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Option_dto_1.OptionDTO]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "saveOption", null);
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Get)('/findall'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "findAllOption", null);
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Put)('/updateOption/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, newOption_dto_1.newOptionDTO]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "updateOption", null);
__decorate([
    (0, common_1.Get)('/getvalueoption'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newOption_dto_1.newOptionDTO]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "GetValueOption", null);
__decorate([
    (0, common_1.Get)('/getoptionvaluebyYear'),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], OptionController.prototype, "GetCurrentOptionValue", null);
OptionController = __decorate([
    (0, common_1.Controller)('/option'),
    __metadata("design:paramtypes", [Option_service_1.OptionService])
], OptionController);
exports.OptionController = OptionController;
//# sourceMappingURL=Option.controller.js.map