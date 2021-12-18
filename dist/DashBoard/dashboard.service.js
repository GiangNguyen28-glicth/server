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
exports.DashBoardService = void 0;
const user_dto_1 = require("../User/DTO/user.dto");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const PassBook_Schema_1 = require("../PassBook/Schema/PassBook.Schema");
const User_Schema_1 = require("../User/Schema/User.Schema");
let DashBoardService = class DashBoardService {
    constructor(usermodel, passbookmodel) {
        this.usermodel = usermodel;
        this.passbookmodel = passbookmodel;
        this.getDeposit = async (filterCurrMonth, filterPrevMonth, prevMonth) => {
            var _a, _b, _c, _d;
            const currMonthData = await this.passbookmodel.aggregate([
                {
                    $match: filterCurrMonth,
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$deposits' },
                        count: { $sum: 1 },
                    },
                },
            ]);
            const prevMonthData = await this.passbookmodel.aggregate([
                {
                    $match: filterPrevMonth,
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$deposits' },
                        count: { $sum: 1 },
                    },
                },
            ]);
            const totalCurrentDeposit = ((_a = currMonthData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const totalPreviousDeposit = ((_b = prevMonthData[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
            const countCurrentDeposit = ((_c = currMonthData[0]) === null || _c === void 0 ? void 0 : _c.count) || 0;
            const countPreviousDeposit = ((_d = prevMonthData[0]) === null || _d === void 0 ? void 0 : _d.count) || 0;
            const totalGrowthRate = totalPreviousDeposit === 0
                ? 0
                : ((totalCurrentDeposit / totalPreviousDeposit) * 100).toFixed(2);
            const countGrowthRate = totalPreviousDeposit === 0
                ? 0
                : ((countCurrentDeposit / countPreviousDeposit) * 100).toFixed(2);
            const totalDeposit = {
                value: totalCurrentDeposit,
                growthRate: totalGrowthRate,
                compareTo: prevMonth,
            };
            const numberOfPassbook = {
                value: countCurrentDeposit,
                growthRate: countGrowthRate,
                compareTo: prevMonth,
            };
            return { totalDeposit, numberOfPassbook };
        };
        this.getCountUser = async (filterCurrMonth, filterPrevMonth, prevMonth) => {
            var _a, _b;
            const currMonthData = await this.usermodel.aggregate([
                {
                    $match: {
                        $and: [
                            filterCurrMonth,
                            {
                                role: 'user',
                            },
                            {
                                isEmailConfirmed: true,
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);
            const prevMonthData = await this.passbookmodel.aggregate([
                {
                    $match: {
                        $and: [
                            filterPrevMonth,
                            {
                                role: 'user',
                            },
                            {
                                isEmailConfirmed: true,
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ]);
            const newUserCurrentMonth = ((_a = currMonthData[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            const newUserPreviousMonth = ((_b = prevMonthData[0]) === null || _b === void 0 ? void 0 : _b.count) || 0;
            const newUserGrowthRate = newUserPreviousMonth === 0
                ? 0
                : ((newUserCurrentMonth / newUserPreviousMonth) * 100).toFixed(2);
            const countUser = {
                value: newUserCurrentMonth,
                growthRate: newUserGrowthRate,
                compareTo: prevMonth,
            };
            return { countUser };
        };
        this.getDepositChart = async (filterCurrMonth, currMonth, dayInMonth) => {
            const groupBy = { date: { $dayOfMonth: '$createAt' } };
            const deposit = await this.passbookmodel.aggregate([
                {
                    $match: {
                        $and: [filterCurrMonth],
                    },
                },
                {
                    $group: {
                        _id: groupBy,
                        total: { $sum: '$deposits' },
                    },
                },
            ]);
            const values = Array(dayInMonth).fill(0);
            for (const d of deposit) {
                values[d._id.date - 1] = d.total;
            }
            const categories = [];
            for (let i = 1; i <= dayInMonth; i++) {
                categories.push(`${i} ${currMonth}`);
            }
            return {
                chartDeposit: {
                    categories,
                    values,
                },
            };
        };
        this.getNewUserChart = async (filterCurrMonth, currMonth, dayInMonth) => {
            const groupBy = { date: { $dayOfMonth: '$createAt' } };
            const user = await this.usermodel.aggregate([
                {
                    $match: {
                        $and: [
                            filterCurrMonth,
                            {
                                role: 'user',
                            },
                            {
                                isEmailConfirmed: true,
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: groupBy,
                        count: { $sum: 1 },
                    },
                },
            ]);
            const values = Array(dayInMonth).fill(0);
            for (const u of user) {
                values[u._id.date - 1] = u.count;
            }
            return {
                chartUser: {
                    currMonth,
                    values,
                },
            };
        };
        this.getNewUsers = async () => {
            const filter = {
                $and: [
                    {
                        role: user_dto_1.UserRole.USER,
                    },
                    {
                        isEmailConfirmed: true,
                    },
                ],
            };
            const users = await this.usermodel
                .find(filter)
                .sort({ createAt: -1 })
                .select('-password -isChangePassword -role -isEmailConfirmed -isExprise -__v')
                .limit(10)
                .lean();
            return {
                newUsers: users,
            };
        };
        this.getNewDeposit = async () => {
            const deposits = await this.passbookmodel
                .find()
                .sort({ createAt: -1 })
                .limit(10)
                .lean();
            return {
                newDeposits: deposits,
            };
        };
    }
    async getData() {
        const date = new Date();
        const dayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const firstDayOfCurrMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfCurrMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const currMonth = `Tháng ${date.getMonth() + 1}`;
        date.setMonth(date.getMonth() - 1);
        const prevMonth = `Tháng ${date.getMonth() + 1}`;
        const firstDayOfPrevMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfPrevMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const filterCurrMonth = {
            createAt: {
                $gt: firstDayOfCurrMonth,
                $lte: lastDayOfCurrMonth,
            },
        };
        const filterPrevMonth = {
            createAt: {
                $gt: firstDayOfPrevMonth,
                $lte: lastDayOfPrevMonth,
            },
        };
        const data = await this.getDeposit(filterCurrMonth, filterPrevMonth, prevMonth);
        const data1 = await this.getCountUser(filterCurrMonth, filterPrevMonth, prevMonth);
        const data2 = await this.getDepositChart(filterCurrMonth, currMonth, dayInMonth);
        const data3 = await this.getNewUserChart(filterCurrMonth, currMonth, dayInMonth);
        const data4 = await this.getNewUsers();
        const data5 = await this.getNewDeposit();
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, data), data1), data2), data3), data4), data5);
    }
};
DashBoardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(User_Schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(PassBook_Schema_1.PassBook.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DashBoardService);
exports.DashBoardService = DashBoardService;
//# sourceMappingURL=dashboard.service.js.map