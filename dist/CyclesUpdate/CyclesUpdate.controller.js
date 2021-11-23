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
exports.CyclesUpdateController = void 0;
const common_1 = require("@nestjs/common");
const IReponse_1 = require("../Utils/IReponse");
const CyclesUpdate_service_1 = require("./CyclesUpdate.service");
const CyclesUpdate_dto_1 = require("./DTO/CyclesUpdate.dto");
let CyclesUpdateController = class CyclesUpdateController {
    constructor(cyclesupdateservice) {
        this.cyclesupdateservice = cyclesupdateservice;
    }
    async saveCyclesUpdate(cyclesupdatedto) {
        return this.cyclesupdateservice.saveCyclesUpdate(cyclesupdatedto);
    }
};
__decorate([
    (0, common_1.Post)('/save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CyclesUpdate_dto_1.CyclesUpdateDTO]),
    __metadata("design:returntype", Promise)
], CyclesUpdateController.prototype, "saveCyclesUpdate", null);
CyclesUpdateController = __decorate([
    (0, common_1.Controller)('/cyclesupdate'),
    __metadata("design:paramtypes", [CyclesUpdate_service_1.CyclesUpdateService])
], CyclesUpdateController);
exports.CyclesUpdateController = CyclesUpdateController;
//# sourceMappingURL=CyclesUpdate.controller.js.map