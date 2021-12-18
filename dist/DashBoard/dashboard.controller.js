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
exports.DashBoardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const role_decorators_1 = require("../decorators/role.decorators");
const role_guard_1 = require("../decorators/role.guard");
const user_dto_1 = require("../User/DTO/user.dto");
let DashBoardController = class DashBoardController {
    constructor(dashboardservice) {
        this.dashboardservice = dashboardservice;
    }
    async getData() {
        return await this.dashboardservice.getData();
    }
};
__decorate([
    (0, role_decorators_1.hasRoles)(user_dto_1.UserRole.ADMIN),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), role_guard_1.RolesGuard),
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashBoardController.prototype, "getData", null);
DashBoardController = __decorate([
    (0, common_1.Controller)('/dashboard'),
    __metadata("design:paramtypes", [dashboard_service_1.DashBoardService])
], DashBoardController);
exports.DashBoardController = DashBoardController;
//# sourceMappingURL=dashboard.controller.js.map