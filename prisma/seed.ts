import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    await prisma.role.createMany({
        data: [
            { name: "User" },
            { name: "Admin" }
        ],
        skipDuplicates: true,
    });

    await prisma.user.createMany({
        data: [
            {
                email: "ductaidev@gmail.com",
                username: "admin",
                firstName: "Lee",
                lastName: "Tai",
                gender: 1,
            },
            {
                email: "davidkellie@gmail.com",
                username: "david-kellie",
                firstName: "David",
                lastName: "Kellie",
                gender: 0
            },
            {
                email: "thomasmuller@gmail.com",
                username: "thomas_muller",
                firstName: "Thomas",
                lastName: "Muller",
                gender: 1
            },
            {
                email: "masonmount@gmail.com",
                username: "mason_mount",
                firstName: "Mason",
                lastName: "Mount",
                gender: 1
            },
        ],
        skipDuplicates: true,
    });

    await prisma.category.createMany({
        data: [
            { name: "Shirt", description: "All of shirt products" },
            { name: "Trousers", description: "All of trousers products" },
            { name: "Shoes", description: "All of shoes products" },
            { name: "Bag", description: "All of bag products" },
        ]
    });
}

main()
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });