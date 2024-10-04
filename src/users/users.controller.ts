import { Controller, Post, Body, UnprocessableEntityException, Query, Get, Request, UseGuards, Res, Patch, Put, Param } from '@nestjs/common';
import { Response } from 'express'; 
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserResponse } from './dto/login-user.dto'
import { AccessReIssueDto } from './dto/reissue-access.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { EditUserInfoDto } from './dto/edit-userInfo.dto';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 구글 oauth
  
  
  @Get('oauth/google')
  @ApiOperation({ summary: '구글화면 이동' })
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  // 구글 로그인
  @Get('login/google')
  @ApiOperation({ summary: 'access 토큰 발급' })
  @ApiResponse({type: LoginUserResponse})
  async googleLogin(@Query('code') code: string, @Res() res: Response) {
    return this.usersService.googleLogin(code, res);
  }

  // access 토큰 재발급
  @Post('refresh')
  @ApiOperation({ summary: 'access 토큰 재발급' })
  @ApiResponse({type: LoginUserResponse})
  async accessReIssue(@Body() accessReIssueDto: AccessReIssueDto) {
    return this.usersService.accessReIssue(accessReIssueDto);
  }

  // 사용자 정보 수정
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 정보 수정' })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({type: BaseResponse})
  async editUserInfo(@Body() editUserInfoDto: EditUserInfoDto, @Param('id') id: number) {
    return this.usersService.editUserInfo(editUserInfoDto, id);
  }
}
