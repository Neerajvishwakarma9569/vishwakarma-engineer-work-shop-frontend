export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Order Placed" },
  { value: "confirmed", label: "Order Confirmed" },
  { value: "in-progress", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
];

export function normalizeOrderStatus(status = "pending") {
  return status === "completed" ? "delivered" : status;
}

export function formatOrderStatus(status = "pending") {
  if (status === "completed") return "Delivered";
  const option = ORDER_STATUS_OPTIONS.find((item) => item.value === status);
  return option?.label || status.replaceAll("-", " ");
}
