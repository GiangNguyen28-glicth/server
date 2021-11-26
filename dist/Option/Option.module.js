"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const Option_controller_1 = require("./Option.controller");
const Option_service_1 = require("./Option.service");
const Option_chema_1 = require("./Schema/Option.chema");
let OptionModule = class OptionModule {
};
OptionModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: Option_chema_1.Option.name, schema: Option_chema_1.OptionSchema }]), common_1.CacheModule.register()],
        controllers: [Option_controller_1.OptionController],
        providers: [Option_service_1.OptionService],
        exports: [Option_service_1.OptionService]
    })
], OptionModule);
exports.OptionModule = OptionModule;
//# sourceMappingURL=Option.module.js.map