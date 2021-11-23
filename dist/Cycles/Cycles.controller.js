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
exports.CyclesController = void 0;
const common_1 = require("@nestjs/common");
const Cycles_service_1 = require("./Cycles.service");
const Cycles_dto_1 = require("./DTO/Cycles.dto");
let CyclesController = class CyclesController {
    constructor(cyclesService) {
        this.cyclesService = cyclesService;
    }
    async saveCycles(cyclesdto) {
        return this.cyclesService.saveCycles(cyclesdto);
    }
    async findAll(id) {
        return this.cyclesService.test(id);
    }
};
__decorate([
    (0, common_1.Post)('/saveCycles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Cycles_dto_1.CyclesDTO]),
    __metadata("design:returntype", Promise)
], CyclesController.prototype, "saveCycles", null);
__decorate([
    (0, common_1.Get)('/findall/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CyclesController.prototype, "findAll", null);
CyclesController = __decorate([
    (0, common_1.Controller)('/cycles'),
    __metadata("design:paramtypes", [Cycles_service_1.CyclesService])
], CyclesController);
exports.CyclesController = CyclesController;
//# sourceMappingURL=Cycles.controller.js.map