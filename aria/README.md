# Aria — AI Customer Support Agent

A production-quality customer support CLI agent built with TypeScript and the [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript). Aria handles order inquiries, explains refund policies, and escalates complex issues to human agents — with full multi-turn conversation history and streaming responses.

## Features

- **Streaming responses** — tokens print as they arrive via the Anthropic streaming API
- **Tool use with agentic loop** — Claude autonomously calls tools and loops until the task is complete
- **Multi-turn memory** — full conversation history is maintained across turns
- **Three tools:**
  - `check_order_status` — looks up order details and tracking info
  - `get_refund_policy` — returns category-specific return/refund policy
  - `escalate_to_human` — creates a support ticket and hands off to a human
- **Fake order data** — five sample orders (ORD-1001 through ORD-1005) ready to test with

## Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

## Setup

```bash
# 1. Install dependencies
cd aria
npm install

# 2. Configure your API key
cp .env.example .env
# Edit .env and paste your ANTHROPIC_API_KEY

# 3. Run
npm run dev          # development (ts-node, no build step)
# or
npm run build && npm start   # compile then run
```

## Usage

```
──────────────────────────────────────────────────────
  Aria — ShopNow Customer Support
──────────────────────────────────────────────────────
Commands: "clear" to reset  •  "quit" to exit
──────────────────────────────────────────────────────

You: What's the status of my order ORD-1002?

Aria: Let me look that up for you.
  [Looking up order...]

Your order ORD-1002 is currently on its way! Here are the details:

  Item: Mechanical Keyboard (x1) — $149.99
  Order Total: $149.99
  Estimated Delivery: January 18, 2024
  Tracking Number: 9400111899223397846100
  Track here: https://track.example.com/9400111899223397846100

Is there anything else I can help you with?
```

### Sample test prompts

| What to try | Expected tool |
|---|---|
| "What's the status of order ORD-1003?" | `check_order_status` |
| "What's your return policy for electronics?" | `get_refund_policy` |
| "My package arrived damaged, what do I do?" | `get_refund_policy` (damaged) |
| "I need to speak to a real person" | `escalate_to_human` |
| "Check ORD-9999" | Error — order not found |

### Sample order IDs

| Order ID | Status | Description |
|---|---|---|
| ORD-1001 | Delivered | Wireless Headphones + Phone Case |
| ORD-1002 | Shipped | Mechanical Keyboard (with tracking) |
| ORD-1003 | Processing | Standing Desk + Monitor Arm |
| ORD-1004 | Cancelled | Gaming Chair |
| ORD-1005 | Pending | Smart Watch + Watch Band |

## Project Structure

```
aria/
├── src/
│   ├── index.ts          # CLI entry point, readline loop
│   ├── agent.ts          # SupportAgent class — streaming + tool loop
│   ├── config.ts         # Model, token limits, system prompt
│   ├── data/
│   │   └── orders.ts     # Sample order data
│   └── tools/
│       ├── definitions.ts  # Tool JSON schemas for the API
│       ├── handlers.ts     # Tool business logic (pure functions)
│       └── executor.ts     # Tool dispatcher + CLI labels
├── .env.example
├── package.json
└── tsconfig.json
```

## How It Works

1. The user types a message in the CLI
2. `SupportAgent.respond()` appends it to the conversation history and calls `runAgentLoop()`
3. The agent opens a streaming request to Claude; text tokens are written directly to stdout
4. `stream.finalMessage()` returns the complete response
5. If `stop_reason === "tool_use"`, all tool calls are executed and their results are appended as a `user` turn — then the loop repeats
6. When Claude returns `end_turn`, the loop exits and control returns to the CLI prompt

## Model

Uses **claude-haiku-4-5** — fast and cost-efficient, ideal for a responsive support agent.
