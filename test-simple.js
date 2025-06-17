require('dotenv').config();

console.log('Testing database connection...');
console.log('DATABASE_URL from env:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');

const { PrismaClient } = require('@prisma/client');

async function test() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    console.log('Trying to connect...');
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const userCount = await prisma.user.count();
    console.log('👤 Total users:', userCount);
    
    const agencyCount = await prisma.agency.count();
    console.log('🏢 Total agencies:', agencyCount);
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();