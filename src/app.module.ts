import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioModule } from 'nestjs-twilio';
import { UserModule } from './User/User.module';
@Module({
  imports: [UserModule,
  ConfigModule.forRoot({isGlobal:true}),
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
