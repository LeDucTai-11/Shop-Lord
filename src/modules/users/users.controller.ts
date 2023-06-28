import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/core/guards/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { ResetPasswordDTO } from '../auth/dto';
import { UpdateUserDTO } from './dto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get("/profile")
    getProfile(@Req() req: any) {
        return this.userService.findByID(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch("/profile")
    updateProfile(@Req() req: any,@Body() updateUserDTO: UpdateUserDTO) {
        return this.userService.updateProfile(req,updateUserDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Post("/request-change-password")
    async requestChangePassword(@Req() req: any) {
        const resetPasswordToken = await this.authService.generateResetPasswordToken(req.user.email);
        return this.authService.sendResetPasswordMail(req.user.email,resetPasswordToken);
    }

    @Post("/change-password")
    @UseGuards(JwtAuthGuard)
    async changePassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
        return await this.authService.resetPassword(resetPasswordDTO);
    }
}
