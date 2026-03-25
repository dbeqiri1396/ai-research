import type Anthropic from "@anthropic-ai/sdk";

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: "check_order_status",
    description:
      "Look up the current status and details of a customer order by order ID. " +
      "Returns order status, line items, tracking information, and estimated delivery date when available. " +
      'Order IDs follow the format "ORD-" followed by numbers (e.g., ORD-1001).',
    input_schema: {
      type: "object",
      properties: {
        order_id: {
          type: "string",
          description:
            'The order ID to look up (e.g., "ORD-1001"). Ask the customer for this if you don\'t have it.',
        },
      },
      required: ["order_id"],
    },
  },
  {
    name: "get_refund_policy",
    description:
      "Retrieve ShopNow's current refund and return policy. " +
      "Call this when a customer asks about returns, refunds, exchanges, or related policies.",
    input_schema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          enum: ["general", "electronics", "clothing", "damaged", "digital"],
          description:
            "The specific policy category the customer is asking about. Use 'general' when no specific category applies.",
        },
      },
      required: ["topic"],
    },
  },
  {
    name: "escalate_to_human",
    description:
      "Create a support ticket and escalate this conversation to a human agent. " +
      "Use when: the customer explicitly requests it, the issue cannot be resolved through available tools, " +
      "the situation involves a dispute or significant financial concern, or the customer is highly distressed.",
    input_schema: {
      type: "object",
      properties: {
        reason: {
          type: "string",
          description:
            "A concise summary of the issue and why it's being escalated. This becomes the ticket description.",
        },
        priority: {
          type: "string",
          enum: ["low", "normal", "high", "urgent"],
          description:
            "Ticket priority. Use 'urgent' only for fraud, safety concerns, or severe service failures.",
        },
      },
      required: ["reason", "priority"],
    },
  },
];
