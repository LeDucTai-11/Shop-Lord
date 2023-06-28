import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";

export class UpdateUserDTO {
    @ApiProperty({required: false,default: 'abc@gmail.com'})
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiProperty({required: false})
    @IsOptional()
    firstName?: string;

    @ApiProperty({required: false})
    @IsOptional()
    lastName?: string;

    @ApiProperty({required: false,default: 1})
    @IsOptional()
    gender?: number;

}