import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../src/generated/prisma/client.ts';

const connectionString = process.env.DATABASE_URL || 'file:./prisma/dev.db';
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const employees = [
  { name: 'Carlos Ruiz',    pin: '1234' },
  { name: 'María López',    pin: '2345' },
  { name: 'David Sánchez',  pin: '3456' },
  { name: 'Ana Martínez',   pin: '4567' },
  { name: 'Jorge Pérez',    pin: '5678' },
];

async function main() {
  console.log('🌱 Seeding database...');

  for (const emp of employees) {
    const pinHash = await bcrypt.hash(emp.pin, 10);
    await prisma.employee.upsert({
      where: { name: emp.name },
      update: { pinHash },
      create: { name: emp.name, pinHash },
    });
    console.log(`  ✓ ${emp.name} (PIN: ${emp.pin})`);
  }

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
