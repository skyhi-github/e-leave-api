import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [LeaveService],
  controllers: [LeaveController],

})
export class RedeemModule {}
