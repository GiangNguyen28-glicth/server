import { UserRole } from 'src/User/DTO/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PassBook,
  PassBookDocument,
} from 'src/PassBook/Schema/PassBook.Schema';
import { User, UserDocument } from 'src/User/Schema/User.Schema';

@Injectable()
export class DashBoardService {
  constructor(
    @InjectModel(User.name) private usermodel: Model<UserDocument>,
    @InjectModel(PassBook.name) private passbookmodel: Model<PassBookDocument>,
  ) {}

  async getData(): Promise<any> {
    const date = new Date();

    const dayInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    ).getDate();

    const firstDayOfCurrMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    );
    const lastDayOfCurrMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    );
    const currMonth = `Tháng ${date.getMonth() + 1}`;

    date.setMonth(date.getMonth() - 1);

    const prevMonth = `Tháng ${date.getMonth() + 1}`;

    const firstDayOfPrevMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
    );
    const lastDayOfPrevMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
    );

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

    const data = await this.getDeposit(
      filterCurrMonth,
      filterPrevMonth,
      prevMonth,
    );

    const data1 = await this.getCountUser(
      filterCurrMonth,
      filterPrevMonth,
      prevMonth,
    );

    const data2 = await this.getDepositChart(
      filterCurrMonth,
      currMonth,
      dayInMonth,
    );

    const data3 = await this.getNewUserChart(
      filterCurrMonth,
      currMonth,
      dayInMonth,
    );

    const data4 = await this.getNewUsers();
    const data5 = await this.getNewDeposit();
    return {
      ...data,
      ...data1,
      ...data2,
      ...data3,
      ...data4,
      ...data5,
    };
  }

  private getDeposit = async (
    filterCurrMonth: object,
    filterPrevMonth: object,
    prevMonth: string,
  ) => {
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

    const totalCurrentDeposit = currMonthData[0]?.total || 0;
    const totalPreviousDeposit = prevMonthData[0]?.total || 0;
    const countCurrentDeposit = currMonthData[0]?.count || 0;
    const countPreviousDeposit = prevMonthData[0]?.count || 0;

    const totalGrowthRate =
      totalPreviousDeposit === 0
        ? 0
        : ((totalCurrentDeposit / totalPreviousDeposit) * 100).toFixed(2);
    const countGrowthRate =
      totalPreviousDeposit === 0
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

  private getCountUser = async (
    filterCurrMonth: object,
    filterPrevMonth: object,
    prevMonth: string,
  ) => {
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

    const newUserCurrentMonth = currMonthData[0]?.count || 0;
    const newUserPreviousMonth = prevMonthData[0]?.count || 0;

    const newUserGrowthRate =
      newUserPreviousMonth === 0
        ? 0
        : ((newUserCurrentMonth / newUserPreviousMonth) * 100).toFixed(2);

    const countUser = {
      value: newUserCurrentMonth,
      growthRate: newUserGrowthRate,
      compareTo: prevMonth,
    };
    return { countUser };
  };

  private getDepositChart = async (
    filterCurrMonth: object,
    currMonth: string,
    dayInMonth: number,
  ) => {
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

  private getNewUserChart = async (
    filterCurrMonth: object,
    currMonth: string,
    dayInMonth: number,
  ) => {
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

  private getNewUsers = async () => {
    const filter = {
      $and: [
        {
          role: UserRole.USER,
        },
        {
          isEmailConfirmed: true,
        },
      ],
    };
    const users = await this.usermodel
      .find(filter)
      .sort({ createAt: -1 })
      .select(
        '-password -isChangePassword -role -isEmailConfirmed -isExprise -__v',
      )
      .limit(10)
      .lean();

    return {
      newUsers: users,
    };
  };

  private getNewDeposit = async () => {
    const deposits = await this.passbookmodel
      .find()
      .sort({ createAt: -1 })
      .limit(10)
      .lean();
    return {
      newDeposits: deposits,
    };
  };
