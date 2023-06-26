import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ResetPasswordDTO {
    @ApiProperty()
    @IsNotEmpty()
    tokenResetPassword: string;

    @ApiProperty()
    @IsNotEmpty()
    newPassword: string;
}