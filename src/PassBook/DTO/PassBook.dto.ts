import { IsObject, IsOptional, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
export class PassBookDTO {
  @Min(10)
  @Max(50)
  deposits: number;
  option: number;
  userId: ObjectId;
  optionId: ObjectId;
  createAt: Date;
  endAt: Date;
}
