import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class EditUserInfoDto {
  @ApiProperty({ type: 'string' })
  @IsOptional()
  email!: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  nickName!: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  phone!: string;

  @ApiProperty({ type: 'string' })
  @IsOptional()
  aboutMe!: string;
}
