import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db";

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

    // Create clue data
    const clueDataPath = path.join(__dirname, "..", "clues.json");
    const clueData = fs.readFileSync(clueDataPath, "utf8");
    const clueDataJson = JSON.parse(clueData);

    for (const clue of clueDataJson) {
      await client.query(
        "INSERT INTO clues (title, data, password, lock_state, order_index) VALUES ($1, $2, $3, $4, $5)",
        [
          clue.title,
          clue.data,
          clue.password,
          clue.lock_state ?? "none",
          clue.order_index,
        ]
      );
    }

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
