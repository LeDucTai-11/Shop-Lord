import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProducDTO, SearchProductDTO, UpdateProductDTO } from './dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
    constructor(
        private prismaService: PrismaService,
        private categoryService: CategoriesService
    ) { }

    async createProduct(createProductDTO: CreateProducDTO) {
        const foundCategory = await this.categoryService.findByID(createProductDTO.categoryId);
        if(foundCategory) {
            return this.prismaService.product.create({
                data: {
                    ...createProductDTO
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    amount: true,
                    price: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    },
                    createdAt: true
                }
            });
        }
    }

    async findAll() {
        return await this.prismaService.product.findMany({
            where: {
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                price: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async findByID(id: string) {
        const product = await this.prismaService.product.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                price: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        });
        if (!product) {
            throw new NotFoundException(`Product not found with ID : ${id}`);
        }
        return product;
    }

    async searchProduct(searchProductDTO: SearchProductDTO) {
        const { priceMin, priceMax,amount } = searchProductDTO;
        if ((priceMin !== undefined || priceMax !== undefined) && (Number(priceMax) <= Number(priceMin))) {
            throw new BadRequestException('priceMax must be greater than priceMin');
        }
        return await this.prismaService.product.findMany({
            where: {
                name: {
                    contains: searchProductDTO.name ?? ''
                },
                amount: {
                    ...(amount !== undefined && { gte: Number(amount) }),
                },
                price: {
                    ...(priceMin !== undefined && { gte: Number(priceMin) }),
                    ...(priceMax !== undefined && { lte: Number(priceMax) }),
                },
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                description: true,
                amount: true,
                price: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    }
                },
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async updateProduct(id: string,updateProductDTO: UpdateProductDTO) {
        const foundProduct = await this.findByID(id);
        if(foundProduct) {
            return await this.prismaService.product.update({
                where: {
                    id,
                },
                data: {
                    ...updateProductDTO,
                    updatedAt: new Date()
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    amount: true,
                    price: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            });
        }
    }
}
