// Creates the database tables. Usage: npm run db:setup
import fs from "node:fs";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is missing. Put it in .env.local first.");
  process.exit(1);
}
const sql = postgres(url, { max: 1 });
await sql.unsafe(fs.readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
console.log("✅ Tables are ready.");
await sql.end();
