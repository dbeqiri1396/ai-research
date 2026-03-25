import Anthropic from "@anthropic-ai/sdk";
import { MODEL, MAX_TOKENS, SYSTEM_PROMPT } from "./config";
import { TOOL_DEFINITIONS } from "./tools/definitions";
import { executeTool, toolLabel } from "./tools/executor";

type Message = Anthropic.MessageParam;

/**
 * SupportAgent manages a stateful multi-turn conversation with Claude,
 * streaming responses to stdout and automatically handling tool call loops.
 */
export class SupportAgent {
  private readonly client: Anthropic;
  private history: Message[];

  constructor() {
    this.client = new Anthropic();
    this.history = [];
  }

  /**
   * Send a user message and stream the full response (including any tool
   * calls) to stdout. Resolves when Claude's final reply is complete.
   */
  async respond(userMessage: string): Promise<void> {
    this.history.push({ role: "user", content: userMessage });
    await this.runAgentLoop();
  }

  /** Clear conversation history to start a fresh session. */
  reset(): void {
    this.history = [];
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private async runAgentLoop(): Promise<void> {
    while (true) {
      const stream = this.client.messages.stream({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: SYSTEM_PROMPT,
        tools: TOOL_DEFINITIONS,
        messages: this.history,
      });

      let wroteText = false;

      for await (const event of stream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta" &&
          event.delta.text
        ) {
          process.stdout.write(event.delta.text);
          wroteText = true;
        }
      }

      const message = await stream.finalMessage();

      // Always append the full content array so tool_use blocks are preserved.
      this.history.push({ role: "assistant", content: message.content });

      if (message.stop_reason !== "tool_use") {
        if (wroteText) process.stdout.write("\n");
        break;
      }

      // Close the text line before showing tool activity.
      if (wroteText) process.stdout.write("\n");

      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of message.content) {
        if (block.type !== "tool_use") continue;

        process.stdout.write(`  [${toolLabel(block.name)}]\n`);

        const resultJson = executeTool(
          block.name,
          block.input as Record<string, unknown>
        );

        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: resultJson,
        });
      }

      process.stdout.write("\n");

      // Feed all tool results back to Claude in a single user turn.
      this.history.push({ role: "user", content: toolResults });
    }
  }
}
