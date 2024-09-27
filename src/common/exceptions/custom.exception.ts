import { HttpException, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../dto/base-response.dto';

export class CustomException extends HttpException {
    constructor(public readonly code: number, public readonly message: string) {
        super(new BaseResponse(false, code, message), HttpStatus.BAD_REQUEST);
    }
}
