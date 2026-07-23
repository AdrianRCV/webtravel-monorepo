#!/bin/sh
set -e

# Verificar que DATABASE_URL esté definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set"
  exit 1
fi

export DATABASE_URL="$DATABASE_URL"

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "🌱 Setting up admin user..."
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Administrador';
  if (!email || !password) {
    console.log('⚠️  ADMIN_EMAIL y ADMIN_PASSWORD no configurados');
    return;
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.password) {
      await prisma.user.update({ where: { email }, data: { password: await bcrypt.hash(password, 10) } });
      console.log('🔑 Contraseña actualizada para:', email);
    } else {
      console.log('✅ Administrador ya existe con contraseña:', email);
    }
  } else {
    await prisma.user.create({
      data: { email, name, password: await bcrypt.hash(password, 10), role: 'ADMIN', emailVerified: new Date() }
    });
    console.log('✅ Administrador creado:', email);
  }
  await prisma.\$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
"

echo "✅ Setup completed successfully"

echo "🚀 Starting NestJS API..."
exec node dist/src/main.js
