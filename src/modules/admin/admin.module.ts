import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { CheckUserIDMiddleware } from '../users/middlewares';
import { ProductsService } from '../products/products.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    UsersService,
    ProductsService,
    CategoriesService
  ]
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckUserIDMiddleware)
        .forRoutes({
          path: 'admin/users/:id',
          method: RequestMethod.ALL
        })
  }
}
