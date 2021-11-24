import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioModule } from 'nestjs-twilio';
import { AppController } from './app.controller';
import { CartModule } from './Cart/Cart.module';
import { CyclesUpdateModule } from './CyclesUpdate/CyclesUpdate.module';
import { OptionModule } from './Option/Option.module';
import { PassBookModule } from './PassBook/PassBook.module';
import { PaypalModule } from './Paypal/Paypal.module';
import { UserModule } from './User/User.module';
@Module({
  imports: [UserModule,OptionModule,CyclesUpdateModule,PaypalModule,PassBookModule,
  CartModule, ConfigModule.forRoot({isGlobal:true}),
  MongooseModule.forRoot(process.env.DATABASE_URL),
  TwilioModule.forRoot({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
