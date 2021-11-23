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
exports.CyclesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Cycles_chema_1 = require("./Schema/Cycles.chema");
let CyclesService = class CyclesService {
    constructor(cyclesmodel) {
        this.cyclesmodel = cyclesmodel;
    }
    async saveCycles(cyclesdto) {
        const result = await this.cyclesmodel.create(cyclesdto);
        result.save();
        return result;
    }
    async test(id) {
        const result = await this.cyclesmodel.findOne({ _id: id });
        console.log(result.Interestrate);
        const test2 = result.Interestrate;
        let keys = Object.keys(test2);
        let values = keys.map(k => test2[k]);
        console.log(values);
        return result;
    }
};
CyclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(Cycles_chema_1.Cycles.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CyclesService);
exports.CyclesService = CyclesService;
//# sourceMappingURL=Cycles.service.js.map