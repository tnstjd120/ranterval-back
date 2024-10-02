import { Controller, Post, Body, UnprocessableEntityException, Query, Get, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express'; 
import { UsersService } from './users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginUserResponse } from './dto/login-user.dto'

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 구글 oauth
  @UseGuards(AuthGuard('google'))
  @Get('oauth/google')
  async googleAuth() {}

  // 구글 로그인
  @Get('login/google')
  @ApiResponse({type: LoginUserResponse})
  async googleLogin(@Query('code') code: string, @Res() res: Response) {
    return this.usersService.googleLogin(code, res);
  }
}
