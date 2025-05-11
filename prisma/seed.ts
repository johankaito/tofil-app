import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a location
  const location = await prisma.location.upsert({
    where: { name: 'Manager Test Location' },
    update: {},
    create: {
      name: 'Manager Test Location',
      organisation: {
        create: {
          name: 'Manager Test Org',
        },
      },
    },
    include: { organisation: true },
  });

  // Create a manager user
  await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      type: 'MANAGER',
      managerLocationId: location.id,
    },
  });

  console.log('Seeded manager user and location.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
}); 