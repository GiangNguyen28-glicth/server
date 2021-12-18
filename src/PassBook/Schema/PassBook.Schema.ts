import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { Date, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/User/Schema/User.Schema';
export type PassBookDocument = PassBook & Document;
@Schema()
export class PassBook {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  deposits: number; // tien gui

  @Prop()
  option: number;

  @Prop({ type: Date })
  createAt: Date;

  @Prop({ type: Date })
  endAt: Date;

  @Prop({ default: false })
  status: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @Type(() => User)
  userId: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true })
  @Type(() => Option)
  optionId: ObjectId;

  @Prop({ type: Object })
  cyclesupdate: Object;
}
export const PassBookSchema = SchemaFactory.createForClass(PassBook);