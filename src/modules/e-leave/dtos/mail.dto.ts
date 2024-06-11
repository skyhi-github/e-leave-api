import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HashID {
  @ApiProperty({ example: 'ZY38DBY' })
  @IsString()
  @IsOptional()
  hash_id: string;
}