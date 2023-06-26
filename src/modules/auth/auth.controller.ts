import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO, ResetPasswordDTO } from './dto/index';
import { CreateUserDTO } from '../users/dto';
import { UsersService } from '../users/users.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Post("/signup")
    signup(@Body() createUserDTO: CreateUserDTO ) {
        return this.authService.signup(createUserDTO);
    }

    @Post("/signin")
    signin(@Body() authDTO: AuthDTO) {
        return this.authService.signin(authDTO);
    }

    @Post("/request-reset-password")
    @ApiQuery({
        name: 'email',
        required: true,
        type: String,
    })
    async requestResetPassword(@Query('email') email: string) {
        const resetPasswordToken = await this.authService.generateResetPasswordToken(email);
        return this.authService.sendResetPasswordMail(email,resetPasswordToken);
    }

    @Post("/reset-password")
    async resetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
        return await this.authService.resetPassword(resetPasswordDTO);
    }
}
