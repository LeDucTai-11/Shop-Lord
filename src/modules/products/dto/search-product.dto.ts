import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class SearchProductDTO {
    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    amount: number;

    @ApiProperty()
    @IsOptional()
    priceMin: number;

    @ApiProperty()
    @IsOptional()
    priceMax: number;
}