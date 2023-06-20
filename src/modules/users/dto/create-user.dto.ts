import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDTO {

    @ApiProperty({default: "abc@gmail.com"})
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({default: "iam_abc"})
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({default: "password"})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({default: "David"})
    @IsString()
    @IsNotEmpty()
    firstName: string;
    
    @ApiProperty({default: "Villa"})
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({default: 1})
    @IsNumber()
    @IsNotEmpty()
    gender: number;

}