import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
  @ApiProperty({ type: 'number' })
  id!: number;

  @ApiProperty({ type: 'string' })
  oAuthId!: string;

  @ApiProperty({ type: 'string' })
  email!: string;

  @ApiProperty({ type: 'string' })
  name!: string;

  @ApiProperty({ type: 'string' })
  nickName!: string | null;

  @ApiProperty({ type: 'string' })
  phone!: string | null;

  @ApiProperty({ type: 'string' })
  profileImage!: string | null;

  @ApiProperty({ type: 'string' })
  aboutMe!: string | null;

  @ApiProperty({ type: 'string' })
  accumulatedAt!: string | null;

  @ApiProperty({ type: 'string' })
  updatedAt!: string | null;

  @ApiProperty({ type: 'string' })
  createdAt!: string;
}

export class UserInfoResponse {
  @ApiProperty({ type: 'boolean' })
  success!: boolean;

  @ApiProperty({ type: 'number' })
  code!: number;

  @ApiProperty({ type: 'string' })
  message!: string | null;

  @ApiProperty({ type: [UserInfoDto] })
  userInfo!: UserInfoDto[];
}
