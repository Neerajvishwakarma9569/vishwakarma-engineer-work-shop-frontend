import React from "react";
import { Check, Circle, Clock3, XCircle } from "lucide-react";
import {
  ORDER_STATUS_OPTIONS,
  formatOrderStatus,
  normalizeOrderStatus,
} from "../utils/orderTracking";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("en-IN");
}

function statusDate(history, status) {
  const event = [...(history || [])]
    .reverse()
    .find((item) => normalizeOrderStatus(item.status) === status);
  return formatDateTime(event?.updatedAt);
}

export default function OrderTrackingTimeline({
  status = "pending",
  paymentStatus = "pending",
  trackingHistory = [],
}) {
  const normalizedStatus = normalizeOrderStatus(status);
  const cancelled = normalizedStatus === "cancelled";
  const previousStatus = cancelled
    ? [...trackingHistory].reverse().find((event) => event.status !== "cancelled")?.status || "pending"
    : normalizedStatus;
  const currentIndex = ORDER_STATUS_OPTIONS.findIndex(
    (step) => step.value === normalizeOrderStatus(previousStatus),
  );
  const steps = ORDER_STATUS_OPTIONS.map((step) => ({
    ...step,
    label: step.value === "confirmed" && paymentStatus !== "paid"
      ? "Order Confirmed"
      : step.value === "confirmed"
        ? "Payment Confirmed"
        : step.label,
  }));
  const history = [...trackingHistory].sort(
    (left, right) => new Date(right.updatedAt || 0) - new Date(left.updatedAt || 0),
  );

  return (
    <section className="tracking-timeline" aria-label="Order status timeline">
      {cancelled && (
        <div className="tracking-cancelled" role="status">
          <XCircle size={19} />
          <span>This order was cancelled.</span>
        </div>
      )}
      <ol className="tracking-steps">
        {steps.map((step, index) => {
          const state = index < currentIndex
            ? "complete"
            : index === currentIndex
              ? "current"
              : "pending";
          const Icon = state === "pending" ? Circle : Check;
          return (
            <li
              className={`tracking-step tracking-step-${state}`}
              key={step.value}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span className="tracking-step-icon"><Icon size={16} /></span>
              <span className="tracking-step-copy">
                <strong>{step.label}</strong>
                <small>
                  {index > currentIndex
                    ? "Pending"
                    : statusDate(trackingHistory, step.value) ||
                      (index === currentIndex ? "Current status" : index === 0 ? "Order received" : "Complete")}
                </small>
              </span>
            </li>
          );
        })}
      </ol>

      <div className="tracking-history">
        <h3><Clock3 size={17} /> Tracking history</h3>
        {history.length ? (
          <ol>
            {history.map((event, index) => (
              <li key={`${event.updatedAt || "event"}-${index}`}>
                <span className="tracking-history-marker" />
                <div>
                  <strong>{formatOrderStatus(event.status)}</strong>
                  {event.message && <p>{event.message}</p>}
                  <small>
                    {formatDateTime(event.updatedAt) || "Time unavailable"}
                    {event.updatedByName ? ` · ${event.updatedByName}` : ""}
                  </small>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="tracking-history-empty">No tracking updates have been recorded yet.</p>
        )}
      </div>
    </section>
  );
}
