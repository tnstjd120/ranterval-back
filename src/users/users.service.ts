import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseResponse } from 'src/common/dto/base-response.dto';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { CustomErrorCode } from 'src/common/exceptions/custom-error-code.enum';

@Injectable()
export class UsersService {
  async createUser(createUserDto: CreateUserDto){
    try {
      if (createUserDto == null) throw new CustomException(CustomErrorCode.INVALID_REQUEST_NULL, "Request is null.");
      
      return new BaseResponse(true);
    } catch (e) {
      if (e instanceof CustomException) {
          return new BaseResponse(false, e.code, e.message);
      } else {
          return new BaseResponse(false, 9998, 'An unexpected error occurred.');
      }
    }
  }
}
