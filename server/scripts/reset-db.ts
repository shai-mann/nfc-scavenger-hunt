import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../src/db";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  const client = await pool.connect();

  try {
    console.log("Dropping existing tables...");

    // Drop tables in reverse dependency order
    await client.query("DROP TABLE IF EXISTS user_progress CASCADE");
    await client.query("DROP TABLE IF EXISTS clues CASCADE");
    await client.query("DROP TABLE IF EXISTS users CASCADE");

    // Drop custom types
    await client.query("DROP TYPE IF EXISTS lock_state_enum CASCADE");

    console.log("Tables dropped successfully");

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, "..", "schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log("Creating tables from schema...");
    await client.query(schemaSql);

    console.log("Database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
