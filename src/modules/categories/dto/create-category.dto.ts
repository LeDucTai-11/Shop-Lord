import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateCategoryDTO {
    @ApiProperty({required: true, default: 'Jackets'})
    @IsNotEmpty()
    name: string;

    @ApiProperty({required: false, default: 'All of Jacket products'})
    description?: string;
}