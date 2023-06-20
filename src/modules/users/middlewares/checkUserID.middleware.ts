import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "../users.service";

@Injectable()
export class CheckUserIDMiddleware implements NestMiddleware {
    constructor(
        private userService: UsersService
    ){}
    async use(req: Request, res: Response, next: NextFunction) {
        const user = await this.userService.findByID(req.params.id);
        if(!user) {
            throw new NotFoundException(`User not found with ID : ${req.params.id}`);
        }
        next();
    }
}