import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './dto';

@Injectable()
export class CategoriesService {
    constructor(private prismaService: PrismaService){}

    async findAll(name?: string) {
        return await this.prismaService.category.findMany({
            where: {
                name: {
                    contains: name ?? ''
                },
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                description: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        price: true,
                        createdAt: true,
                    }
                },
                createdAt: true,
            }
        });
    }

    async findByID(id: string) {
        const category = await this.prismaService.category.findFirst({
            where: {
                id: id,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                description: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        price: true,
                        createdAt: true,
                    }
                },
                createdAt: true,
            }
        });
        if(!category) {
            throw new NotFoundException(`Category not found with ID : ${id}`);
        }
        return category;
    }

    async findByName(name: string) {
        const category = await this.prismaService.category.findFirst({
            where: {
                name: name,
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                description: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        price: true,
                        createdAt: true,
                    }
                },
                createdAt: true,
            }
        });
        return category;
    }

    async createCategory(createCategoryDTO: CreateCategoryDTO) {
        const category = await this.findByName(createCategoryDTO.name);
        if(category) {
            throw new BadRequestException('The name Category has already exist !');
        }
        return await this.prismaService.category.create({
            data: {
                ...createCategoryDTO
            },
            select: {
                id: true,
                name: true,
                description: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        price: true,
                        createdAt: true,
                    }
                },
                createdAt: true,
            }
        });
    }

    async updateCategory(id: string,updateCategoryDTO: UpdateCategoryDTO) {
        const foundCategory = await this.findByID(id);
        if(updateCategoryDTO.name) {
            const category = await this.findByName(updateCategoryDTO.name);
            if(category && category.id !== foundCategory.id) {
                throw new BadRequestException('The name Category has already exist !');
            }
        }
        return await this.prismaService.category.update({
            where: {
                id: foundCategory.id
            },
            data: {
                ...updateCategoryDTO,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                name: true,
                description: true,
                products: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        amount: true,
                        price: true,
                        createdAt: true,
                    }
                },
                createdAt: true,
            }
        })
    }
}
