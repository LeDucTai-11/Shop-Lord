import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import * as argon from 'argon2';
import { Role } from 'src/core/enum/roles.enum';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }

    async findByUserName(userName: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                username: userName,
            },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });
        return user;
    }

    async findAll() {
        return this.prismaService.user.findMany({
            where: {
                userRoles: {
                    some: {
                        roleId: Role.User
                    }
                }
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                gender: true,
                userRoles: {
                    select: {
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        deletedAt: null
                    }
                },
                createdAt: true
            }
        });
    }

    async findByID(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                gender: true,
                userRoles: {
                    select: {
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        deletedAt: null
                    }
                },
                createdAt: true
            }
        });
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                gender: true,
                passwordResetToken: true,
                passwordResetExpiration: true,
                userRoles: {
                    select: {
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        deletedAt: null
                    }
                },
                createdAt: true
            }
        });
        return user;
    }

    async findByResetPasswordToken(resetPasswordToken: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                passwordResetToken: resetPasswordToken,
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                gender: true,
                passwordResetToken: true,
                passwordResetExpiration: true,
                userRoles: {
                    select: {
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        deletedAt: null
                    }
                },
                createdAt: true
            }
        });
        return user;
    }

    async createUser(createUserDTO: CreateUserDTO) {
        const hashedPassword = await argon.hash(createUserDTO.password);
        return this.prismaService.user.create({
            data: {
                email: createUserDTO.email,
                username: createUserDTO.username,
                password: hashedPassword,
                firstName: createUserDTO.firstName,
                lastName: createUserDTO.lastName,
                gender: createUserDTO.gender,
                userRoles: {
                    create: {
                        roleId: Role.User
                    }
                },
                userCart: {
                    create: {
                    }
                }
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                gender: true,
                userRoles: {
                    select: {
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        deletedAt: null,
                    }
                },
                createdAt: true
            }
        });
    }

    async updateResetPassword(userID: string, resetPasswordToken: string, resetPasswordExpiration: Date) {
        try {
            return await this.prismaService.user.update({
                where: {
                    id: userID,
                },
                data: {
                    passwordResetToken: resetPasswordToken,
                    passwordResetExpiration: resetPasswordExpiration,
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    gender: true,
                    userRoles: {
                        select: {
                            roleId: true,
                            role: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        },
                        where: {
                            deletedAt: null,
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            })
        } catch (e) {
            throw new HttpException(e.message, 500, {
                cause: new Error('Some Error'),
            });
        }
    }

    async updatePassword(userID: string, password: string) {
        const hashedPassword = await argon.hash(password);
        try {
            return await this.prismaService.user.update({
                where: {
                    id: userID,
                },
                data: {
                    password: hashedPassword,
                    updatedAt: new Date(),
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    gender: true,
                    userRoles: {
                        select: {
                            roleId: true,
                            role: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            }
                        },
                        where: {
                            deletedAt: null,
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            })
        } catch (e) {
            throw new HttpException(e.message, 500, {
                cause: new Error('Some Error'),
            });
        }
    }

    async updateProfile(req: any, updateUserDTO: UpdateUserDTO) {
        if (updateUserDTO.email) {
            const user = await this.findByEmail(updateUserDTO.email);
            if (user && user.id !== req.user.id) {
                throw new BadRequestException('The email has already exist !');
            }
        }
        return await this.prismaService.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                ...updateUserDTO,
                updatedAt: new Date()
            },
            select: {
                id: true,
                email: true,
                username: true,
                firstName: true,
                lastName: true,
                gender: true,
                userRoles: {
                    select: {
                        roleId: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        deletedAt: null,
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        })
    }
}
