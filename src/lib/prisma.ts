import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// In Prisma 7 the connection is supplied at runtime through a driver adapter.
// The Neon adapter talks to Postgres over HTTP/WebSocket, which works in
// serverless environments (e.g. Vercel) where a long-lived TCP pool can't be
// shared across invocations.
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// Reuse a single PrismaClient across hot reloads in development to avoid
// exhausting database connections.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
