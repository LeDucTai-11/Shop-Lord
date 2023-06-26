import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO, ResetPasswordDTO } from './dto/index';
import * as argon from 'argon2';
import { UsersService } from '../users/users.service';
import { CreateUserDTO } from '../users/dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto'

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private userService : UsersService,
        private jwtService : JwtService,
        private configService: ConfigService,
        private mailService : MailService,
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

    async generateResetPasswordToken(email: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new NotFoundException(`User not found with EMAIL : ${email}`);
        }
        if(user.passwordResetExpiration < new Date()) {
            const forgetPasswordToken = crypto.randomBytes(16).toString('hex');
            const forgetPasswordExpiration = new Date(Date.now() + 10 * 60000);
            await this.userService.updateResetPassword(user.id,forgetPasswordToken,forgetPasswordExpiration);
            return forgetPasswordToken;
        }else {
            return user.passwordResetToken;
        }
    }

    async sendResetPasswordMail(email: string,forgetPasswordToken: string) {
        return await this.mailService.sendResetPasswordMail(email,forgetPasswordToken);
    }

    async resetPassword(resetPasswordDTO: ResetPasswordDTO) {
        const user = await this.userService.findByResetPasswordToken(resetPasswordDTO.tokenResetPassword);
        if(!user) {
            throw new NotFoundException(`Invalid Token !`);
        }
        if(user.passwordResetExpiration < new Date()) {
            throw new BadRequestException('Reset password Token has already expired.');
        }
        return await this.userService.updatePassword(user.id,resetPasswordDTO.newPassword);
    }
}
