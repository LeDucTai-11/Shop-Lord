import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CategoriesService
  ]
})
export class ProductsModule {}
