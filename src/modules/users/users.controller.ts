import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/core/guards/jwt/jwt.guard';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private userService: UsersService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    getProfile(@Req() req: any) {
        return this.userService.findByID(req.user.id);
    }

    @Patch("/change-password")
    @UseGuards(JwtAuthGuard)
    @ApiProperty({
        name: 'newPassword',
        required: true,
        type: String,
        example: 'password',
    })
    changePassword(
        @Req() req: any,
        @Query('newPassword') newPassword: string
    ) {
        return this.userService.updatePassword(req.user.id, newPassword);
    }
}
