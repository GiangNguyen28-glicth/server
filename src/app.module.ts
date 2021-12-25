import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { CartModule } from './Cart/Cart.module';
import { DashBoardModule } from './DashBoard/dashboard.module';
import { LocationModule } from './location/location.module';
import { OptionModule } from './Option/Option.module';
import { PassBookModule } from './PassBook/PassBook.module';
import { PaypalModule } from './Paypal/Paypal.module';
import { UserModule } from './User/User.module';
@Module({
  imports: [UserModule,OptionModule,PaypalModule,PassBookModule,LocationModule,DashBoardModule,
  CartModule, ConfigModule.forRoot({isGlobal:true}),
  MongooseModule.forRoot(process.env.DATABASE_URL),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
