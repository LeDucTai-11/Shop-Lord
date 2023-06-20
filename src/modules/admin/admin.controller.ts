import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import RoleGuard from 'src/core/guards/roles/roles.guard';
import { Role } from 'src/core/enum/roles.enum';

@ApiTags('admin')
@Controller('admin')
@ApiBearerAuth()
export class AdminController {
    constructor(
        private userService : UsersService
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
}
