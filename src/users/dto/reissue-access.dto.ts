import { ApiProperty } from '@nestjs/swagger';

export class AccessReIssueDto {
  @ApiProperty({ type: 'number' })
  userId!: number;

  @ApiProperty({ type: 'string' })
  refreshToken!: string;
}
