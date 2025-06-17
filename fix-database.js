require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Verificando e corrigindo dados do banco...');
  
  try {
    // 1. Criar uma agência de teste se não existir
    let agency = await prisma.agency.findFirst();
    
    if (!agency) {
      console.log('🏢 Criando agência de teste...');
      
      // Primeiro, criar um usuário temporário para ser o owner
      const tempUser = await prisma.user.create({
        data: {
          email: 'temp@example.com',
          name: 'Temp User',
          password: await bcrypt.hash('temp123', 10),
          role: 'OWNER',
        },
      });
      
      // Criar a agência
      agency = await prisma.agency.create({
        data: {
          name: 'Agência Teste',
          slug: 'agencia-teste',
          ownerId: tempUser.id,
          plan: 'PRO',
        },
      });
      
      // Atualizar o usuário temporário para vincular à agência
      await prisma.user.update({
        where: { id: tempUser.id },
        data: { agencyId: agency.id },
      });
      
      console.log('✅ Agência criada:', {
        id: agency.id,
        name: agency.name,
        slug: agency.slug,
        plan: agency.plan
      });
    } else {
      console.log('✅ Agência já existe:', agency.name);
    }
    
    // 2. Verificar se temos um usuário admin vinculado à agência
    let adminUser = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com',
        agencyId: agency.id,
      },
    });
    
    if (!adminUser) {
      console.log('👤 Criando/atualizando usuário admin...');
      
      // Tentar encontrar usuário existente
      const existingUser = await prisma.user.findUnique({
        where: { email: 'admin@example.com' },
      });
      
      if (existingUser) {
        // Atualizar usuário existente
        adminUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            agencyId: agency.id,
            role: 'ADMIN',
          },
        });
        console.log('✅ Usuário admin atualizado');
      } else {
        // Criar novo usuário
        adminUser = await prisma.user.create({
          data: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: await bcrypt.hash('admin123', 10),
            role: 'ADMIN',
            agencyId: agency.id,
          },
        });
        console.log('✅ Usuário admin criado');
      }
    } else {
      console.log('✅ Usuário admin já existe e está vinculado à agência');
    }
    
    // 3. Criar alguns clientes de teste
    const existingClients = await prisma.client.findMany({
      where: { agencyId: agency.id },
    });
    
    if (existingClients.length === 0) {
      console.log('👥 Criando clientes de teste...');
      
      const clientsData = [
        {
          name: 'João Silva',
          email: 'joao@exemplo.com',
          phone: '(11) 99999-1111',
          company: 'Empresa A',
          agencyId: agency.id,
        },
        {
          name: 'Maria Santos',
          email: 'maria@exemplo.com',
          phone: '(11) 99999-2222',
          company: 'Empresa B',
          agencyId: agency.id,
        },
        {
          name: 'Carlos Oliveira',
          email: 'carlos@exemplo.com',
          phone: '(11) 99999-3333',
          company: 'Empresa C',
          agencyId: agency.id,
        },
      ];
      
      for (const clientData of clientsData) {
        await prisma.client.create({ data: clientData });
      }
      
      console.log('✅ Clientes de teste criados');
    } else {
      console.log(`✅ Já existem ${existingClients.length} clientes na agência`);
    }
    
    // 4. Mostrar resumo final
    const finalStats = await Promise.all([
      prisma.agency.count(),
      prisma.user.count({ where: { agencyId: agency.id } }),
      prisma.client.count({ where: { agencyId: agency.id } }),
    ]);
    
    console.log('\n📊 Resumo do banco de dados:');
    console.log(`🏢 Agências: ${finalStats[0]}`);
    console.log(`👤 Usuários na agência: ${finalStats[1]}`);
    console.log(`👥 Clientes na agência: ${finalStats[2]}`);
    
    console.log('\n🎯 Dados para login:');
    console.log('Email: admin@example.com');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('❌ Erro ao configurar banco:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();