import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponse {
  @ApiProperty({ type: 'boolean'})
  success!: boolean;

  @ApiProperty({ type: 'number' })
  code!: number;

  @ApiProperty({ example: null })
  message!: string;

  @ApiProperty({ type: 'string' })
  accessToken!: string;
}
