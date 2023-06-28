import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateCategoryDTO {
    @ApiProperty({required: false})
    @IsOptional()
    name?: string;

    @ApiProperty({required: false})
    @IsOptional()
    description?: string;
}