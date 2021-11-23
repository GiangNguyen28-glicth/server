"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyclesUpdateModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const CyclesUpdate_controller_1 = require("./CyclesUpdate.controller");
const CyclesUpdate_service_1 = require("./CyclesUpdate.service");
const CyclesUpdate_schema_1 = require("./Schema/CyclesUpdate.schema");
let CyclesUpdateModule = class CyclesUpdateModule {
};
CyclesUpdateModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: CyclesUpdate_schema_1.CyclesUpdate.name, schema: CyclesUpdate_schema_1.CyclesUpdateSchema }])],
        controllers: [CyclesUpdate_controller_1.CyclesUpdateController],
        providers: [CyclesUpdate_service_1.CyclesUpdateService],
        exports: [CyclesUpdate_service_1.CyclesUpdateService]
    })
], CyclesUpdateModule);
exports.CyclesUpdateModule = CyclesUpdateModule;
//# sourceMappingURL=CyclesUpdate.module.js.map