import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
    @ApiProperty()
    success: boolean;

    @ApiProperty()
    code: number;

    @ApiProperty()
    message: string | null;

    constructor(success: boolean = true, code: number = 0, message: string | null = null) {
        this.success = success;
        this.code = code;
        this.message = message;
    }
}
