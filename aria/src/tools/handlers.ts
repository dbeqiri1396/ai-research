import { ORDERS } from "../data/orders";

// ---------------------------------------------------------------------------
// Shared response shape
// ---------------------------------------------------------------------------

interface SuccessResult<T> {
  success: true;
  data: T;
}

interface ErrorResult {
  success: false;
  error: string;
}

type ToolResult<T> = SuccessResult<T> | ErrorResult;

// ---------------------------------------------------------------------------
// check_order_status
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<string, string> = {
  pending: "Order placed — awaiting processing",
  processing: "Being prepared for shipment",
  shipped: "On its way to you",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function checkOrderStatus(orderId: string): ToolResult<object> {
  const key = orderId.trim().toUpperCase();
  const order = ORDERS[key];

  if (!order) {
    return {
      success: false,
      error:
        `No order found with ID "${orderId}". ` +
        "Please double-check the order ID — it should look like ORD-1001.",
    };
  }

  return {
    success: true,
    data: {
      orderId: order.id,
      status: order.status,
      statusLabel: STATUS_LABELS[order.status] ?? order.status,
      customerName: order.customerName,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: `$${item.price.toFixed(2)}`,
      })),
      orderTotal: `$${order.total.toFixed(2)}`,
      orderDate: order.createdAt,
      estimatedDelivery: order.estimatedDelivery ?? null,
      trackingNumber: order.trackingNumber ?? null,
      trackingUrl: order.trackingUrl ?? null,
      cancellationReason: order.cancellationReason ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// get_refund_policy
// ---------------------------------------------------------------------------

const POLICIES: Record<string, string> = {
  general: `
ShopNow Return & Refund Policy

- Standard return window: 30 days from delivery date
- Items must be unused and in original packaging with tags/documentation
- Refunds issued within 3–5 business days of receiving the return
- Original shipping costs are non-refundable (unless the error was ours)
- Free return label provided for defective or incorrect items; $5.99 flat fee for all other returns
- Refunds go back to the original payment method`.trim(),

  electronics: `
ShopNow Electronics Return Policy

- Return window: 30 days from delivery
- Must include all original accessories, cables, and documentation
- Device must not be activated, enrolled, or registered
- Remove all personal data before returning
- Opened software and license codes are non-returnable
- Manufacturer warranties apply separately`.trim(),

  clothing: `
ShopNow Clothing & Apparel Return Policy

- Extended return window: 60 days from delivery
- Items must be unworn, unwashed, and have original tags attached
- Final sale items (marked at checkout) cannot be returned
- Undergarments and swimwear are final sale for hygiene reasons
- Free size exchanges within 30 days of delivery`.trim(),

  damaged: `
ShopNow Damaged or Defective Item Policy

- Report damage or defects within 48 hours of delivery
- Photograph the item and its packaging before anything else
- Contact us via this chat or at support@shopnow.example.com
- We will arrange free return shipping and send a replacement or full refund immediately
- Severely damaged items may not need to be returned — photos may be sufficient`.trim(),

  digital: `
ShopNow Digital Products Policy

- Digital downloads, activation codes, and subscriptions are non-refundable once delivered
- Exception: if the product is defective or materially not as described, contact us within 7 days
- Gift cards are non-refundable and non-transferable
- Subscription cancellations take effect at end of the current billing period`.trim(),
};

export function getRefundPolicy(topic: string): ToolResult<object> {
  const policy = POLICIES[topic] ?? POLICIES["general"];
  return {
    success: true,
    data: { topic, policy },
  };
}

// ---------------------------------------------------------------------------
// escalate_to_human
// ---------------------------------------------------------------------------

let ticketCounter = 5000;

const WAIT_TIMES: Record<string, string> = {
  low: "1–2 business days",
  normal: "4–8 hours",
  high: "1–2 hours",
  urgent: "within 30 minutes",
};

export function escalateToHuman(
  reason: string,
  priority: string
): ToolResult<object> {
  const ticketId = `TKT-${++ticketCounter}`;
  const waitTime = WAIT_TIMES[priority] ?? WAIT_TIMES["normal"];

  return {
    success: true,
    data: {
      ticketId,
      priority,
      estimatedResponse: waitTime,
      confirmationMessage:
        `Support ticket ${ticketId} created. A human agent will reach out ${waitTime}.`,
      escalationReason: reason,
    },
  };
}
