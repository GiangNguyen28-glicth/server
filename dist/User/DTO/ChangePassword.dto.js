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
exports.changePassword = void 0;
const class_validator_1 = require("class-validator");
class changePassword {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(?=.*[a-zA-z\d@$!%*#?&.=])(?=.*\d)(?=.*[@$!%*#?&.=])[A-Za-z\d@$!%*#?&.=]{8,}$/, {
        message: '8 Ký tự bao gồm 1 chữ hoa, 1 ký tự đặc biệt',
    }),
    __metadata("design:type", String)
], changePassword.prototype, "password", void 0);
exports.changePassword = changePassword;
//# sourceMappingURL=ChangePassword.dto.js.map