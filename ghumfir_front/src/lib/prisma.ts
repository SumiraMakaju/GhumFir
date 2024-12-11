import { PrismaClient } from '@prisma/client'

// Extend the global object to include our Prisma client
declare global {
  var prisma: PrismaClient | undefined
}

// Create a function to instantiate Prisma client
function createPrismaClient() {
  return new PrismaClient();
}

// Create or reuse the Prisma client
let prisma: PrismaClient;

if (globalThis.prisma) {
  prisma = globalThis.prisma;
} else {
  prisma = createPrismaClient(); // Ensure the client is initialized correctly
}

// In development, store the client on global object to prevent 
// multiple instances from being created due to hot reloading
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma