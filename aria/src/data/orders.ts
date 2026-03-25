export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  total: number;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  cancellationReason?: string;
}

export const ORDERS: Record<string, Order> = {
  "ORD-1001": {
    id: "ORD-1001",
    customerId: "CUST-501",
    customerName: "Alice Johnson",
    status: "delivered",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 89.99 },
      { name: "Phone Case", quantity: 2, price: 12.50 },
    ],
    total: 114.99,
    createdAt: "2024-01-10",
    estimatedDelivery: "2024-01-15",
    trackingNumber: "1Z999AA10123456784",
    trackingUrl: "https://track.example.com/1Z999AA10123456784",
  },
  "ORD-1002": {
    id: "ORD-1002",
    customerId: "CUST-502",
    customerName: "Bob Martinez",
    status: "shipped",
    items: [
      { name: "Mechanical Keyboard", quantity: 1, price: 149.99 },
    ],
    total: 149.99,
    createdAt: "2024-01-14",
    estimatedDelivery: "2024-01-18",
    trackingNumber: "9400111899223397846100",
    trackingUrl: "https://track.example.com/9400111899223397846100",
  },
  "ORD-1003": {
    id: "ORD-1003",
    customerId: "CUST-503",
    customerName: "Carol Smith",
    status: "processing",
    items: [
      { name: "Standing Desk", quantity: 1, price: 399.00 },
      { name: "Monitor Arm", quantity: 1, price: 79.99 },
    ],
    total: 478.99,
    createdAt: "2024-01-15",
    estimatedDelivery: "2024-01-22",
  },
  "ORD-1004": {
    id: "ORD-1004",
    customerId: "CUST-504",
    customerName: "David Lee",
    status: "cancelled",
    items: [
      { name: "Gaming Chair", quantity: 1, price: 299.99 },
    ],
    total: 299.99,
    createdAt: "2024-01-12",
    cancellationReason: "Customer requested cancellation",
  },
  "ORD-1005": {
    id: "ORD-1005",
    customerId: "CUST-505",
    customerName: "Emma Wilson",
    status: "pending",
    items: [
      { name: "Smart Watch", quantity: 1, price: 249.99 },
      { name: "Watch Band", quantity: 2, price: 19.99 },
    ],
    total: 289.97,
    createdAt: "2024-01-16",
    estimatedDelivery: "2024-01-23",
  },
};
