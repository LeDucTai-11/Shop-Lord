import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import RoleGuard from 'src/core/guards/roles/roles.guard';
import { Role } from 'src/core/enum/roles.enum';
import { CreateProducDTO, UpdateProductDTO } from '../products/dto';
import { ProductsService } from '../products/products.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../categories/dto';
import { CategoriesService } from '../categories/categories.service';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
    constructor(
        private userService : UsersService,
        private productService: ProductsService,
        private categoryService: CategoriesService
    ){}

    @Get("/users")
    @UseGuards(RoleGuard(Role.Admin))
    findAll() {
        return this.userService.findAll();
    }

    @Get("/users/:id")
    @UseGuards(RoleGuard(Role.Admin))
    findByID(@Param('id') id: string) {
        return this.userService.findByID(id);
    }

    @Post("/categories")
    @UseGuards(RoleGuard(Role.Admin))
    createCategory(@Body() createCategoryDTO : CreateCategoryDTO) {
        return this.categoryService.createCategory(createCategoryDTO);
    }

    @Patch("/categories/:id")
    @UseGuards(RoleGuard(Role.Admin))
    updateCategory(@Param('id') id:string,@Body() updateCategoryDTO: UpdateCategoryDTO) {
        return this.categoryService.updateCategory(id,updateCategoryDTO);
    }

    @Post("/products")
    @UseGuards(RoleGuard(Role.Admin))
    createProduct(@Body() createProductDTO: CreateProducDTO){
        return this.productService.createProduct(createProductDTO);
    }

    @Patch("/products/:id")
    @UseGuards(RoleGuard(Role.Admin))
    updateProduct(@Param('id') id: string,@Body() updateProductDTO: UpdateProductDTO) {
        return this.productService.updateProduct(id,updateProductDTO);
    }
}
