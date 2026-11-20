import fs from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const PORT = 5433;
const DB_NAME = "thelovers";
const dataDir = path.join(process.cwd(), ".dev-db", "data");

async function main() {
  const pg = new EmbeddedPostgres({
    databaseDir: dataDir,
    user: "postgres",
    password: "postgres",
    port: PORT,
    persistent: true,
  });

  const fresh = !fs.existsSync(path.join(dataDir, "PG_VERSION"));
  if (fresh) await pg.initialise();
  await pg.start();

  if (fresh) await pg.createDatabase(DB_NAME);

  console.log(`Base de datos de desarrollo lista: postgresql://postgres:postgres@localhost:${PORT}/${DB_NAME}`);
  console.log("Déjala abierta mientras trabajas. Ctrl+C para apagarla.");

  const stop = async () => {
    await pg.stop();
    process.exit(0);
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  setInterval(() => {}, 1 << 30);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
