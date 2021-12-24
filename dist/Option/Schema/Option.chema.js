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
exports.OptionSchema = exports.Option = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
let Option = class Option {
};
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", Object)
], Option.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, require: true }),
    __metadata("design:type", Number)
], Option.prototype, "option", void 0);
__decorate([
    (0, mongoose_1.Prop)({ require: true }),
    __metadata("design:type", Number)
], Option.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Option.prototype, "createAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Array)
], Option.prototype, "history", void 0);
Option = __decorate([
    (0, mongoose_1.Schema)()
], Option);
exports.Option = Option;
exports.OptionSchema = mongoose_1.SchemaFactory.createForClass(Option);
//# sourceMappingURL=Option.chema.js.map