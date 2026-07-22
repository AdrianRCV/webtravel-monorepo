import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/webtravel?schema=public';

const connectionString = process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrador';

  if (!email || !password) {
    throw new Error('❌ ADMIN_EMAIL y ADMIN_PASSWORD son requeridos en .env');
  }

  if (password.length < 8) {
    throw new Error('❌ ADMIN_PASSWORD debe tener al menos 8 caracteres');
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`⚠️  Administrador ya existe con email: ${email}`);
    console.log(`   ID: ${existingAdmin.id}`);
    console.log(`   Role: ${existingAdmin.role}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Administrador creado exitosamente:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Nombre: ${admin.name}`);
  console.log(`   ID: ${admin.id}`);
  console.log(`   Role: ${admin.role}`);
  console.log(`   Verificado: ${admin.emailVerified}`);
}

main()
  .catch((e) => {
    console.error('❌ Error al crear administrador:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
