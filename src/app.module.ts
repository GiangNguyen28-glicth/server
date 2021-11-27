import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioModule } from 'nestjs-twilio';
import { AppController } from './app.controller';
import { CartModule } from './Cart/Cart.module';
import { LocationModule } from './location/location.module';
import { OptionModule } from './Option/Option.module';
import { PassBookModule } from './PassBook/PassBook.module';
import { PaypalModule } from './Paypal/Paypal.module';
import { UserModule } from './User/User.module';
@Module({
  imports: [UserModule,OptionModule,PaypalModule,PassBookModule,LocationModule,
  CartModule, ConfigModule.forRoot({isGlobal:true}),
  MongooseModule.forRoot(process.env.DATABASE_URL),
  TwilioModule.forRoot({
    accountSid: "AC6c195ae195ad3154101bdcb5a6f4a778",
    authToken: "74dfac367ba511dd8919c04a7ac480e8",
  })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
