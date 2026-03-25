import { createInterface } from "readline/promises";
import { stdin, stdout, exit } from "process";
import dotenv from "dotenv";
import { SupportAgent } from "./agent";

dotenv.config();

// ---------------------------------------------------------------------------
// Startup checks
// ---------------------------------------------------------------------------

if (!process.env["ANTHROPIC_API_KEY"]) {
  console.error(
    "Error: ANTHROPIC_API_KEY is not set.\n" +
    "Create a .env file with:\n\n" +
    "  ANTHROPIC_API_KEY=your_api_key_here\n"
  );
  exit(1);
}

// ---------------------------------------------------------------------------
// CLI helpers
// ---------------------------------------------------------------------------

const DIVIDER = "─".repeat(58);

function printBanner(): void {
  console.log(DIVIDER);
  console.log("  Aria — ShopNow Customer Support");
  console.log(DIVIDER);
  console.log('Commands: "clear" to reset  •  "quit" to exit');
  console.log(DIVIDER);
  console.log();
}

// ---------------------------------------------------------------------------
// Main loop
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  printBanner();

  const agent = new SupportAgent();
  const rl = createInterface({ input: stdin, output: stdout });

  // Graceful Ctrl+C
  rl.on("close", () => {
    console.log("\nGoodbye!");
    exit(0);
  });

  while (true) {
    let input: string;

    try {
      input = (await rl.question("You: ")).trim();
    } catch {
      // readline closed (e.g. piped input finished)
      break;
    }

    if (!input) continue;

    const cmd = input.toLowerCase();

    if (cmd === "quit" || cmd === "exit") {
      console.log("\nThanks for contacting ShopNow. Have a great day!");
      rl.close();
      break;
    }

    if (cmd === "clear") {
      agent.reset();
      console.log("\n[Conversation cleared — starting fresh]\n");
      continue;
    }

    process.stdout.write("\nAria: ");

    try {
      await agent.respond(input);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stdout.write(`\n[Error: ${message}]\n`);
    }

    console.log();
  }
}

main();
