import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {

  @ApiProperty({ example: ['00937', '00938'] })
  @IsNotEmpty({ each: true })
  employee_ids: string[];

  @ApiProperty({ example: ['1990-01-01', '1995-02-02'] })
  @IsNotEmpty({ each: true })
  dobs: string[];

  @ApiProperty({ example: ['015293609', '015293610'] })
  @IsNotEmpty({ each: true })
  phones: string[];
}
