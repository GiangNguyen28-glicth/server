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
    accountSid: "AC6c195ae195ad3154101bdcb5a6f4a778",
    authToken: "9b38cccd9011ad0c95bffe594a0169d0",
  })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
