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
exports.CyclesUpdateSchema = exports.CyclesUpdate = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const class_transformer_1 = require("class-transformer");
const mongoose = require("mongoose");
const PassBook_Schema_1 = require("../../PassBook/Schema/PassBook.Schema");
let CyclesUpdate = class CyclesUpdate {
};
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toString()),
    __metadata("design:type", Object)
], CyclesUpdate.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], CyclesUpdate.prototype, "value", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Number)
], CyclesUpdate.prototype, "currentMoney", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], CyclesUpdate.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], CyclesUpdate.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'PassBook' }),
    __metadata("design:type", Object)
], CyclesUpdate.prototype, "passbookId", void 0);
CyclesUpdate = __decorate([
    (0, mongoose_1.Schema)()
], CyclesUpdate);
exports.CyclesUpdate = CyclesUpdate;
exports.CyclesUpdateSchema = mongoose_1.SchemaFactory.createForClass(CyclesUpdate);
//# sourceMappingURL=CyclesUpdate.schema.js.map