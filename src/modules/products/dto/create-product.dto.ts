import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProducDTO {
    @ApiProperty({required: true,default: 'Áo sơ mi đen'})
    @IsNotEmpty()
    name: string;

    @ApiProperty({default: 'Đây là sản phẩm của Lord-Shop'})
    description: string;

    @ApiProperty({required: true,default: 100})
    @IsNumber()
    amount: number;

    @ApiProperty({required: true,default: 120000})
    @IsNumber()
    price: number;

    @ApiProperty({required: true})
    @IsNotEmpty()
    categoryId: string;
}