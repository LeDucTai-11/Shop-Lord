import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/index';
import { CreateUserDTO } from '../users/dto';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UsersService
    ) {}

    @Post("/signup")
    signup(@Body() createUserDTO: CreateUserDTO ) {
        return this.authService.signup(createUserDTO);
    }

    @Post("/signin")
    signin(@Body() authDTO: AuthDTO) {
        return this.authService.signin(authDTO);
    }
}
