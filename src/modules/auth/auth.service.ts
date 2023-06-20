import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto/index';
import * as argon from 'argon2';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private userService : UsersService,
        private jwtService : JwtService,
        private configService: ConfigService
    ){}

    async signup(createUserDTO: CreateUserDTO){
        const foundUser = await this.userService.findByUserName(createUserDTO.username);
        if(foundUser) {
            throw new BadRequestException(`User is existed with USERNAME: ${createUserDTO.username}`);
        }
        const newUser = await this.userService.createUser(createUserDTO);
        return this.signJwtToken(newUser.id,newUser.username);
    }

    async signin(authDTO: AuthDTO) {
        const foundUser = await this.userService.findByUserName(authDTO.username);
        if(!foundUser) {
            throw new ForbiddenException(`User not found with USERNAME: ${authDTO.username}`);
        }
        const passwordMatched = await argon.verify(
            foundUser.password,
            authDTO.password
        );
        if(!passwordMatched) {
            throw new ForbiddenException(`Incorrect password !`);
        }
        return this.signJwtToken(foundUser.id,foundUser.username);
    }

    async signJwtToken(userId: string, username: string) {
        const payload = {
            sub: userId,
            username,
        };
        const accessToken = await this.jwtService.signAsync(payload,{
            expiresIn: '10m',
            secret: this.configService.get('JWT_SECRET'),
        });
        return {
            accessToken
        }
    }

}
