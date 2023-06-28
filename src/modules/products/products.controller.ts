import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { SearchProductDTO } from './dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private productService: ProductsService) {}

    @Get()
    findAll() {
        return this.productService.findAll();
    }

    @Get('/search')
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        example: 'Áo'
    })
    @ApiQuery({
        name: 'amount',
        required: false,
        type: Number,
        example: 20
    })
    @ApiQuery({
        name: 'priceMin',
        required: false,
        type: Number,
        example: 50000
    })
    @ApiQuery({
        name: 'priceMax',
        required: false,
        type: Number,
        example: 200000
    })
    searchProduct(@Query() searchProductDTO: SearchProductDTO){
        return this.productService.searchProduct(searchProductDTO);
    }

    @Get('/:id')
    findByID(@Param('id') id: string) {
        return this.productService.findByID(id);
    }
}
