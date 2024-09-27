import { Controller, Post, Body, UnprocessableEntityException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/base-response.dto';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 유저 생성
  @Post()
  @ApiCreatedResponse({ type: BaseResponse})
  async createUser(@Body() createUserDto: CreateUserDto) {
    var createUserResponse = await this.usersService.createUser(createUserDto);

    if (!createUserResponse.success)
    {
      return new UnprocessableEntityException(createUserResponse);
    }

    return createUserResponse;
  }
}
