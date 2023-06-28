import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) {}

    @Get()
    @ApiQuery({
        name: 'name',
        required: false,
        type: String,
        example: 'Shirt'
    })
    async findAll(@Query('name') name: string) {
        return await this.categoryService.findAll(name);
    }

    @Get("/:id")
    async findByID(@Param('id') id: string) {
        return await this.categoryService.findByID(id);
    }
}
