import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.activityLog.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.userProfile.deleteMany();

  // Create demo users (IDs should match Supabase auth user IDs - use placeholder UUIDs)
  const admin = await prisma.userProfile.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440001', // Replace with real Supabase user ID
      email: 'admin@company.com',
      fullName: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const manager = await prisma.userProfile.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440002', // Replace with real Supabase user ID
      email: 'manager@company.com',
      fullName: 'Manager User',
      role: 'MANAGER',
      isActive: true,
    },
  });

  const member = await prisma.userProfile.create({
    data: {
      id: '550e8400-e29b-41d4-a716-446655440003', // Replace with real Supabase user ID
      email: 'member@company.com',
      fullName: 'Member User',
      role: 'MEMBER',
      isActive: true,
    },
  });

  console.log('Created users:', { admin, manager, member });

  // Create sample tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Login page not loading',
      description: 'Users report that the login page shows a blank white screen on mobile devices.',
      status: 'OPEN',
      priority: 'HIGH',
      category: 'TECHNICAL',
      customerEmail: 'john@example.com',
      customerName: 'John Smith',
      createdById: admin.id,
      assignedToId: manager.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Billing invoice not received',
      description: 'Customer did not receive monthly billing invoice. Please check and resend.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      category: 'BILLING',
      customerEmail: 'jane@example.com',
      customerName: 'Jane Doe',
      createdById: manager.id,
      assignedToId: member.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: 'Request: Dark mode implementation',
      description: 'Feature request from multiple users for dark mode support in the application.',
      status: 'OPEN',
      priority: 'LOW',
      category: 'FEATURE_REQUEST',
      customerEmail: 'support@company.com',
      customerName: 'Support Team',
      createdById: admin.id,
      assignedToId: null, // Unassigned
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      title: 'Database connection timeout',
      description: 'API endpoints timing out when database is under heavy load.',
      status: 'RESOLVED',
      priority: 'URGENT',
      category: 'TECHNICAL',
      customerEmail: 'tech@company.com',
      customerName: 'Tech Team',
      createdById: manager.id,
      assignedToId: manager.id,
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  });

  const ticket5 = await prisma.ticket.create({
    data: {
      title: 'Password reset email link invalid',
      description: 'Password reset emails contain invalid/expired token links.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      category: 'TECHNICAL',
      customerEmail: 'support@example.com',
      customerName: 'Support',
      createdById: admin.id,
      assignedToId: member.id,
    },
  });

  console.log('Created tickets:', { ticket1, ticket2, ticket3, ticket4, ticket5 });

  // Create activity logs
  await prisma.activityLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'USER_CREATED',
        entityType: 'UserProfile',
        entityId: admin.id,
        metadata: { role: 'ADMIN' },
      },
      {
        userId: admin.id,
        action: 'USER_CREATED',
        entityType: 'UserProfile',
        entityId: manager.id,
        metadata: { role: 'MANAGER' },
      },
      {
        userId: admin.id,
        action: 'USER_CREATED',
        entityType: 'UserProfile',
        entityId: member.id,
        metadata: { role: 'MEMBER' },
      },
      {
        userId: admin.id,
        action: 'TICKET_CREATED',
        entityType: 'Ticket',
        entityId: ticket1.id,
        metadata: { title: ticket1.title, priority: 'HIGH' },
      },
      {
        userId: manager.id,
        action: 'TICKET_ASSIGNED',
        entityType: 'Ticket',
        entityId: ticket2.id,
        metadata: { assignedTo: member.id },
      },
    ],
  });

  console.log('Seed completed successfully!');
  console.log('\nDemo Credentials:');
  console.log('Admin: admin@company.com / password123');
  console.log('Manager: manager@company.com / password123');
  console.log('Member: member@company.com / password123');
  console.log('\nIMPORTANT: Replace the user IDs in seed.js with real Supabase auth user IDs after creating them in Supabase.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
