import { checkOrderStatus, getRefundPolicy, escalateToHuman } from "./handlers";

/**
 * Dispatches a tool call by name and returns a JSON-serialized result string
 * suitable for use as a tool_result content block.
 */
export function executeTool(
  name: string,
  input: Record<string, unknown>
): string {
  let result: unknown;

  switch (name) {
    case "check_order_status":
      result = checkOrderStatus(input["order_id"] as string);
      break;

    case "get_refund_policy":
      result = getRefundPolicy(input["topic"] as string);
      break;

    case "escalate_to_human":
      result = escalateToHuman(
        input["reason"] as string,
        input["priority"] as string
      );
      break;

    default:
      result = { success: false, error: `Unknown tool: "${name}"` };
  }

  return JSON.stringify(result, null, 2);
}

/** Human-readable label shown in the CLI while a tool is running. */
export function toolLabel(name: string): string {
  switch (name) {
    case "check_order_status":
      return "Looking up order...";
    case "get_refund_policy":
      return "Retrieving refund policy...";
    case "escalate_to_human":
      return "Creating support ticket...";
    default:
      return `Running ${name}...`;
  }
}
