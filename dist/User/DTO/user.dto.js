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
exports.UserRole = exports.UserDTO = void 0;
const class_validator_1 = require("class-validator");
class UserDTO {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDTO.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UserDTO.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(?=.*[a-zA-z\d@$!%*#?&.=])(?=.*\d)(?=.*[@$!%*#?&.=])[A-Za-z\d@$!%*#?&.=]{8,}$/, {
        message: '8 characters including 1 uppercase letter, 1 special character',
    }),
    __metadata("design:type", String)
], UserDTO.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/, {
        message: 'Phone Incorrect',
    }),
    __metadata("design:type", String)
], UserDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserDTO.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserDTO.prototype, "role", void 0);
exports.UserDTO = UserDTO;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
//# sourceMappingURL=user.dto.js.map