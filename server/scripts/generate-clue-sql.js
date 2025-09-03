// scripts/generate-sql.js
import fs from "fs";
import path from "path";

// Paths
const cluesPath = path.resolve("./clues.json");
const outputPath = path.resolve("./insert-clues.sql");

// Read JSON data
const clues = JSON.parse(fs.readFileSync(cluesPath, "utf8"));

// Escape single quotes for SQL
function escapeSQL(value) {
  return value.replace(/'/g, "''");
}

// Build SQL statements
const sqlStatements = clues.map((clue) => {
  const id = clue.id;
  const title = escapeSQL(clue.title);
  const dataJson = escapeSQL(JSON.stringify(clue.data || {}));
  const nfc_tag_id = escapeSQL(clue.password);
  const order_index = clue.order_index ?? 0;

  return `
INSERT INTO clues (id, title, data, nfc_tag_id, order_index)
VALUES ('${id}', '${title}', '${dataJson}'::jsonb, '${nfc_tag_id}', ${order_index})
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    data = EXCLUDED.data,
    nfc_tag_id = EXCLUDED.nfc_tag_id,
    order_index = EXCLUDED.order_index;`;
});

// Write the SQL file
const sqlOutput = sqlStatements.join("\n") + "\n";
fs.writeFileSync(outputPath, sqlOutput);

console.log(`✅ Generated ${outputPath}`);
