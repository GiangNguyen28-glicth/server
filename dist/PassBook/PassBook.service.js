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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassBookService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose = require("mongoose");
const CyclesUpdate_service_1 = require("../CyclesUpdate/CyclesUpdate.service");
const CyclesUpdate_dto_1 = require("../CyclesUpdate/DTO/CyclesUpdate.dto");
const CyclesUpdate_schema_1 = require("../CyclesUpdate/Schema/CyclesUpdate.schema");
const Option_service_1 = require("../Option/Option.service");
const HistoryAction_obj_1 = require("../User/DTO/HistoryAction.obj");
const User_Schema_1 = require("../User/Schema/User.Schema");
const User_service_1 = require("../User/User.service");
const clear_cache_1 = require("../Utils/clear.cache");
const IReponse_1 = require("../Utils/IReponse");
const cache_key_dto_1 = require("./DTO/cache.key.dto");
const PassBook_Schema_1 = require("./Schema/PassBook.Schema");
const cache_manager_1 = require("cache-manager");
let PassBookService = class PassBookService {
    constructor(passbookmodel, cacheManager, connection, userservice, cyclesupdateservice, optionservice) {
        this.passbookmodel = passbookmodel;
        this.cacheManager = cacheManager;
        this.connection = connection;
        this.userservice = userservice;
        this.cyclesupdateservice = cyclesupdateservice;
        this.optionservice = optionservice;
    }
    async saveSavingsdeposit(passbookdto, user) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const svdp = await this.passbookmodel.create(passbookdto);
            svdp.save();
            await this.userservice.updateSvd(svdp, user);
            return { code: 200, success: true, message: "Succes",
            };
        }
        catch (err) {
            session.abortTransaction();
            return { code: 500, success: false, message: err.message
            };
        }
    }
    async getTotalCycles(passbookid, user) {
        cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT = passbookid.toString() + "PROFIT";
        const checkCache = await this.cacheManager.get(cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT);
        if (checkCache == undefined) {
            cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT = passbookid.toString() + "PROFIT";
        }
        else {
            return checkCache;
        }
        var endDate = new Date();
        let value;
        const svd = await this.passbookmodel.findOne({ _id: passbookid, userId: user._id });
        if (!svd) {
            return { code: 500, success: false, message: "Cant find Passbook in DB" };
        }
        const startDate = new Date(`${svd.createAt}`);
        let result = [];
        const startcycle = new CyclesUpdate_dto_1.CyclesUpdateDTO();
        while (startDate <= endDate) {
            const startcycle = new CyclesUpdate_dto_1.CyclesUpdateDTO();
            value = await this.optionservice.GetValueOption(startDate, svd.option);
            startcycle.startDate = new Date(startDate);
            startDate.setMonth(startDate.getMonth() + svd.option);
            startcycle.endDate = new Date(startDate);
            startcycle.value = value;
            result.push(startcycle);
        }
        let money = svd.deposits;
        for (let i = 0; i < result.length - 1; i++) {
            money = ((money * (result[i].value / 100)) * svd.option / 12) + money;
            result[i].currentMoney = money;
        }
        const diffDays = (date, otherDate) => Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
        const date = diffDays(endDate, result[result.length - 1].startDate);
        money = money + money * 0.0001 * (date - 1) / 360;
        await this.cacheManager.set(cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PROFIT, { data: result, money: money }, { ttl: 1000 });
        return {
            data: result,
            money: money
        };
    }
    async GetAllPassbookByUserId(user) {
        const passbook = await this.passbookmodel.find({ userId: user._id });
        if (cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK == "") {
            cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_TOTAL_PASSBOOK = user._id.toString() + "GETALLPASSBOOK";
        }
        return passbook;
    }
    async GetPassbookIsActive(user) {
        if (cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_IS_ACTIVE == "") {
            cache_key_dto_1.CacheKeyPassbook.GET_PASSBOOK_CACHE_KEY_IS_ACTIVE = user._id.toString() + "GET_PASSBOOK_CACHE_KEY_IS_ACTIVE";
        }
        const passbook = await this.passbookmodel.find({ userId: user._id, status: false });
        return passbook;
    }
    async GetPassBookById(passbookid, user) {
        return this.passbookmodel.findOne({ userId: user._id, _id: passbookid });
    }
    async withdrawMoneyPassbook(passbookid, user) {
        const passbook = await this.passbookmodel.findOne({ _id: passbookid, userId: user._id });
        if (!passbook) {
            console.log("Passbook not found");
            return null;
        }
        ;
        if (passbook.status) {
            console.log("Passbook is not Active");
            return null;
        }
        ;
        const { data, money } = await this.getTotalCycles(passbookid, user);
        passbook.update({ status: true });
        passbook.save();
        await this.userservice.updateMoney(HistoryAction_obj_1.Action.WITHDRAWAL, money, user);
        return null;
    }
};
PassBookService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(PassBook_Schema_1.PassBook.name)),
    __param(1, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __param(2, (0, mongoose_1.InjectConnection)()),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => User_service_1.UserService))),
    __metadata("design:paramtypes", [mongoose.Model, typeof (_a = typeof cache_manager_1.Cache !== "undefined" && cache_manager_1.Cache) === "function" ? _a : Object, mongoose.Connection, User_service_1.UserService,
        CyclesUpdate_service_1.CyclesUpdateService,
        Option_service_1.OptionService])
], PassBookService);
exports.PassBookService = PassBookService;
//# sourceMappingURL=PassBook.service.js.map