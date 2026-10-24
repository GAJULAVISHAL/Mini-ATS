import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const databaseUrl = new URL(connectionString);

if (databaseUrl.searchParams.get("sslmode") === "require") {
  databaseUrl.searchParams.set("sslmode", "verify-full");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl.toString(),
  connectionTimeoutMillis: 30_000,
  idleTimeoutMillis: 30_000,
  max: 5,
}, {
  onPoolError: (error) => {
    console.error("PostgreSQL pool error:", error);
  },
});

export const prisma = new PrismaClient({
  adapter,
});