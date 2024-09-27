import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    loginId!: string;

    @IsString()
    password!: string;

    @IsString()
    email!: string;

    @IsString()
    name!: string;

    @IsString()
    nickName!: string;

    @IsString()
    phone!: string;

    @IsOptional()
    @IsString()
    profileImage?: string;
    
    @IsOptional()
    @IsString()
    aboutMe?: string;
}