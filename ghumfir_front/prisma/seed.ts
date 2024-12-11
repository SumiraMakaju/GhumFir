import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user with related sessions
  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      username: 'TestUser',
      displayName: 'Test User',
      email: 'test@test.com',
      passwordHash: '$2y$12$GBfcgD6XwaMferSOdYGiduw3Awuo95QAPhxFE0oNJ.Ds8qj3pzEZy', // Example bcrypt hash
      googleId: null,
      avatarUrl: 'https://example.com/avatar.jpg',
      bio: 'This is a test user.',
      sessions: {
        create: [
          {
            id: 'session-1',
            expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
          },
          {
            id: 'session-2',
            expiresAt: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // 2 days from now
          },
        ],
      },
    },
  });

  console.log('Seeded user:', user);
}

main()
  .then(() => {
    console.log('Seeding completed.');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Error while seeding:', e);
    prisma.$disconnect();
    process.exit(1);
  });
