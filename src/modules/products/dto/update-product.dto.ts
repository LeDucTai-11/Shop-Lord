import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateProductDTO {
    @ApiProperty({required: false})
    @IsOptional()
    name?: string;

    @ApiProperty({required: false})
    @IsOptional()
    description?: string;

    @ApiProperty({required: false})
    @IsOptional()
    amount?: number;

    @ApiProperty({required: false})
    @IsOptional()
    price?: number;
}