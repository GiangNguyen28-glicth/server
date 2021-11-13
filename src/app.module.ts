import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioModule } from 'nestjs-twilio';
import { CyclesModule } from './Cycles/Cycles.module';
import { CyclesUpdateModule } from './CyclesUpdate/CyclesUpdate.module';
import { PaypalModule } from './Paypal/Paypal.module';
import { SavingsDepositModule } from './SavingsDeposit/savingsdeposit.module';
import { UserModule } from './User/User.module';
@Module({
  imports: [UserModule,CyclesModule,CyclesUpdateModule,PaypalModule,SavingsDepositModule,  ConfigModule.forRoot({isGlobal:true}),
  MongooseModule.forRoot(process.env.DATABASE_URL),
  TwilioModule.forRoot({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
