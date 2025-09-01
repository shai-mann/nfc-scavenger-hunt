import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runDevWithReset() {
  const shouldReset =
    process.argv.includes("--reset") || process.argv.includes("-r");
  const shouldWatch =
    process.argv.includes("--watch") || process.argv.includes("-w");

  if (shouldReset) {
    console.log("Resetting database before starting development server...");

    // Run the reset script
    const resetProcess = spawn("tsx", [path.join(__dirname, "reset-db.ts")], {
      stdio: "inherit",
      shell: true,
    });

    resetProcess.on("close", (code) => {
      if (code === 0) {
        console.log(
          "Database reset complete. Starting development server...\n"
        );
        startDevServer(shouldWatch);
      } else {
        console.error("Database reset failed");
        process.exit(1);
      }
    });
  } else {
    startDevServer(shouldWatch);
  }
}

function startDevServer(watch: boolean) {
  const command = watch ? "tsx" : "tsx";
  const args = watch ? ["watch", "src/index.ts"] : ["src/index.ts"];

  const devProcess = spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });

  devProcess.on("close", (code) => {
    process.exit(code || 0);
  });
}

runDevWithReset();
