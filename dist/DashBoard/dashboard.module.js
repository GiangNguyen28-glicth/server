"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashBoardModule = void 0;
const dashboard_service_1 = require("./dashboard.service");
const User_module_1 = require("../User/User.module");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const PassBook_Schema_1 = require("../PassBook/Schema/PassBook.Schema");
const User_Schema_1 = require("../User/Schema/User.Schema");
const dashboard_controller_1 = require("./dashboard.controller");
let DashBoardModule = class DashBoardModule {
};
DashBoardModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: PassBook_Schema_1.PassBook.name, schema: PassBook_Schema_1.PassBookSchema },
            ]),
            mongoose_1.MongooseModule.forFeature([{ name: User_Schema_1.User.name, schema: User_Schema_1.UserSchema }]),
            User_module_1.UserModule,
        ],
        controllers: [dashboard_controller_1.DashBoardController],
        providers: [dashboard_service_1.DashBoardService],
    })
], DashBoardModule);
exports.DashBoardModule = DashBoardModule;
//# sourceMappingURL=dashboard.module.js.map