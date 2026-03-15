import * as path from 'path';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load .env from project root (works when run as dist/src/prisma/seed.js)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

const connectionString = process.env.DB_URI;
if (!connectionString || connectionString.trim() === '') {
  console.error('Missing DB_URI. Set DB_URI in your .env file to a valid PostgreSQL connection string.');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing database...');
  await prisma.auditLog.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.blacklistedToken.deleteMany();

  console.log('Seeding Roles...');
  const roles = {
    admin: await prisma.role.create({ data: { name: 'Admin' } }),
    manager: await prisma.role.create({ data: { name: 'Manager' } }),
    agent: await prisma.role.create({ data: { name: 'Agent' } }),
    customer: await prisma.role.create({ data: { name: 'Customer' } }),
  };

  console.log('Seeding Permissions...');
  const permissionsData = [
    { atom: 'dashboard.view', description: 'View dashboard' },
    { atom: 'users.read', description: 'Read users' },
    { atom: 'users.write', description: 'Write users' },
    { atom: 'users.suspend', description: 'Suspend users' },
    { atom: 'leads.manage', description: 'Manage leads' },
    { atom: 'tasks.manage', description: 'Manage tasks' },
    { atom: 'reports.view', description: 'View reports' },
    { atom: 'audit.read', description: 'Read audit logs' },
    { atom: 'settings.manage', description: 'Manage system settings' },
    { atom: 'customer.portal', description: 'Access customer portal' },
  ];

  const permissions: any[] = [];
  for (const p of permissionsData) {
    permissions.push(await prisma.permission.create({ data: p }));
  }

  console.log('Seeding Role Permissions...');
  // Admin gets everything
  for (const p of permissions) {
    await prisma.rolePermission.create({
      data: { roleId: roles.admin.id, permissionId: p.id },
    });
  }
  
  // Manager gets most
  const managerPerms = ['dashboard.view', 'users.read', 'leads.manage', 'tasks.manage', 'reports.view', 'audit.read'];
  for (const p of permissions.filter(p => managerPerms.includes(p.atom))) {
    await prisma.rolePermission.create({
      data: { roleId: roles.manager.id, permissionId: p.id },
    });
  }

  // Agent gets limited
  const agentPerms = ['dashboard.view', 'leads.manage', 'tasks.manage'];
  for (const p of permissions.filter(p => agentPerms.includes(p.atom))) {
    await prisma.rolePermission.create({
      data: { roleId: roles.agent.id, permissionId: p.id },
    });
  }

  console.log('Seeding Users (Large Batch)...');
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('Password123!', salt);
  
  const users: any[] = [];
  
  // 5 Admins
  for (let i = 1; i <= 5; i++) {
    users.push(await prisma.user.create({
      data: { email: `admin${i}@example.com`, password, name: `Admin User ${i}`, roleId: roles.admin.id },
    }));
  }

  // 25 Managers
  for (let i = 1; i <= 25; i++) {
    users.push(await prisma.user.create({
      data: { email: `manager${i}@example.com`, password, name: `Manager ${i}`, roleId: roles.manager.id },
    }));
  }

  // 80 Agents
  for (let i = 1; i <= 80; i++) {
    const isSuspended = i >= 1 && i <= 3; // agent1, agent2, agent3 suspended
    users.push(await prisma.user.create({
      data: {
        email: `agent${i}@example.com`,
        password,
        name: `Agent ${i}`,
        roleId: roles.agent.id,
        isSuspended,
      },
    }));
  }

  // 300 Customers (some suspended, some banned for testing)
  for (let i = 1; i <= 300; i++) {
    const isSuspended = i >= 1 && i <= 10; // customer1–10 suspended
    const isBanned = i >= 50 && i <= 59;   // customer50–59 banned
    users.push(await prisma.user.create({
      data: {
        email: `customer${i}@example.com`,
        password,
        name: `Customer ${i}`,
        roleId: roles.customer.id,
        isSuspended,
        isBanned,
      },
    }));
  }

  // Re-fetch users so we have correct refs (including suspended/banned)
  const allUsers = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  const userByEmail = (email: string) => allUsers.find((u) => u.email === email)!;

  console.log('Seeding Custom User Permissions...');
  const reportPerm = permissions.find((p) => p.atom === 'reports.view');
  const auditPerm = permissions.find((p) => p.atom === 'audit.read');
  const customerPortalPerm = permissions.find((p) => p.atom === 'customer.portal');
  const adminUser = userByEmail('admin1@example.com');

  // Agents 1–15: extra reports.view; agents 1–8: audit.read
  for (let i = 1; i <= 15; i++) {
    const agent = userByEmail(`agent${i}@example.com`);
    if (reportPerm && agent) {
      await prisma.userPermission.create({
        data: { userId: agent.id, permissionId: reportPerm.id, grantedBy: adminUser.id },
      });
    }
    if (auditPerm && agent && i <= 8) {
      await prisma.userPermission.create({
        data: { userId: agent.id, permissionId: auditPerm.id, grantedBy: adminUser.id },
      });
    }
  }

  // Customers 1–5: grant customer.portal (e.g. for testing “my permissions”)
  if (customerPortalPerm) {
    for (let i = 1; i <= 5; i++) {
      const customer = userByEmail(`customer${i}@example.com`);
      await prisma.userPermission.create({
        data: { userId: customer.id, permissionId: customerPortalPerm.id, grantedBy: adminUser.id },
      });
    }
  }

  console.log('Seeding Audit Logs (Huge Volume)...');
  const actions = [
    'user.login',
    'user.logout',
    'data.view',
    'permission.update',
    'user.create',
    'user.suspend',
    'user.ban',
    'settings.change',
    'user.update',
    'audit.read',
    'reports.view',
  ];
  const auditLogs: { userId: string; action: string; targetId: string | null; details: object; ip: string }[] = [];

  for (let i = 0; i < 3500; i++) {
    const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const needsTarget = action === 'user.suspend' || action === 'user.ban' || action === 'permission.update';
    const targetUser = needsTarget ? allUsers[Math.floor(Math.random() * allUsers.length)] : null;
    auditLogs.push({
      userId: randomUser.id,
      action,
      targetId: targetUser ? targetUser.id : null,
      details: {
        timestamp: new Date(),
        info: `Bulk action log #${i}`,
        action,
        metadata: { random_id: Math.random().toString(36).substring(7) },
      },
      ip: `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    });
  }

  await prisma.auditLog.createMany({ data: auditLogs });

  console.log(`Database seeded successfully!
- Roles: 4
- Permissions: 10
- Users: ${allUsers.length} (3 suspended agents, 10 suspended + 10 banned customers)
- User permission overrides: multiple agents + 5 customers
- Audit Logs: 3500`);
}

main()
  .catch((e: any) => {
    if (e?.code === 'P1010') {
      console.error(
        'Database access denied (P1010). Check that DB_URI in .env is correct, the database user has read/write access, and (if using Neon) the project is not paused.',
      );
    } else {
      console.error(e);
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
