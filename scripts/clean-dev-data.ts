import "dotenv/config";
import { rm } from "node:fs/promises";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

async function main() {
  if (process.env.NODE_ENV === "production") throw new Error("No se ejecuta en producción.");
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  const { count } = await db.order.deleteMany();
  await db.$disconnect();
  await rm(".uploads", { recursive: true, force: true });
  console.log(`Datos de prueba eliminados: ${count} pedidos y la carpeta .uploads.`);
}

main();
