import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, MapPin, PackageCheck, Truck } from "lucide-react";
import api from "../services/api";
import OrderTrackingTimeline from "../components/OrderTrackingTimeline";
import { formatOrderStatus } from "../utils/orderTracking";
import "./Css/TrackOrder.css";

const formatDate = (value, includeTime = false) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString("en-IN", includeTime
      ? { dateStyle: "medium", timeStyle: "short" }
      : { dateStyle: "medium" });
};

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api.get(`/orders/track/${id}`)
      .then(({ data }) => {
        if (active) setOrder(data);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.response?.data?.message || "Could not load this order.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <main className="track-order-page container section"><p role="status">Loading order tracking...</p></main>;
  }

  if (error || !order) {
    return (
      <main className="track-order-page container section">
        <Link className="track-back-link" to="/my-orders"><ArrowLeft size={16} /> Back to My Orders</Link>
        <div className="track-order-error" role="alert">{error || "Order not found."}</div>
      </main>
    );
  }

  const status = order.orderStatus || order.status || "pending";

  return (
    <main className="track-order-page container section">
      <Link className="track-back-link" to="/my-orders"><ArrowLeft size={16} /> Back to My Orders</Link>
      <header className="track-order-heading">
        <div>
          <span className="eyebrow">ORDER TRACKING</span>
          <h1>Track your order</h1>
          <p>Order #{String(order._id).slice(-6).toUpperCase()} · Placed {formatDate(order.createdAt, true)}</p>
        </div>
        <span className={`order-status status-${status}`}>{formatOrderStatus(status)}</span>
      </header>

      <section className="track-order-overview">
        <div className="track-overview-card">
          <Truck size={20} />
          <span>Tracking number</span>
          <strong>{order.trackingNumber || "Not assigned yet"}</strong>
        </div>
        <div className="track-overview-card">
          <CalendarDays size={20} />
          <span>Expected delivery</span>
          <strong>{formatDate(order.expectedDelivery)}</strong>
        </div>
        <div className="track-overview-card">
          <PackageCheck size={20} />
          <span>Payment status</span>
          <strong className="track-payment-value">
            {order.paymentStatus || "pending"}
            {order.paymentMethod === "cash-on-delivery" && order.paymentStatus !== "paid"
              ? " · Cash on delivery"
              : ""}
          </strong>
        </div>
      </section>

      <section className="track-order-panel">
        <div className="track-panel-heading">
          <div>
            <span className="eyebrow">LIVE UPDATES</span>
            <h2>Delivery progress</h2>
          </div>
          <span className="track-latest-status">
            Latest: {formatOrderStatus(status)}
          </span>
        </div>
        <OrderTrackingTimeline
          status={status}
          paymentStatus={order.paymentStatus}
          trackingHistory={order.trackingHistory || []}
        />
      </section>

      <div className="track-order-columns">
        <section className="track-order-panel">
          <div className="track-panel-heading">
            <div>
              <span className="eyebrow">YOUR PURCHASE</span>
              <h2>Products and payment</h2>
            </div>
          </div>
          <div className="track-products">
            {order.items?.map((item, index) => (
              <article className="track-product" key={`${item.product || item.name}-${index}`}>
                {item.image
                  ? <img src={item.image} alt={item.name || "Purchased product"} />
                  : <div className="track-product-placeholder"><PackageCheck size={20} /></div>}
                <div>
                  <strong>{item.name || "Product"}</strong>
                  {item.category && <span>{item.category}</span>}
                  <span>Quantity: {item.quantity}</span>
                  {item.description && <span>{item.description}</span>}
                  {(item.heightCm || item.widthCm) && (
                    <span>
                      {item.heightCm ? `Height: ${item.heightCm} cm` : ""}
                      {item.heightCm && item.widthCm ? " · " : ""}
                      {item.widthCm ? `Width: ${item.widthCm} cm` : ""}
                    </span>
                  )}
                  {item.usedMaterials?.length > 0 && (
                    <span>Materials: {item.usedMaterials.join(", ")}</span>
                  )}
                </div>
                <b>₹{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</b>
              </article>
            ))}
          </div>
          <dl className="track-payment-summary">
            <div><dt>Payment method</dt><dd>{(order.paymentMethod || "offline").replaceAll("-", " ")}</dd></div>
            <div><dt>Payment status</dt><dd>{order.paymentStatus || "pending"}</dd></div>
            <div className="track-total"><dt>Order total</dt><dd>₹{formatPrice(order.totalAmount)}</dd></div>
          </dl>
        </section>

        <section className="track-order-panel track-delivery-panel">
          <div className="track-panel-heading">
            <div>
              <span className="eyebrow">DELIVERY DETAILS</span>
              <h2>Shipping address</h2>
            </div>
            <MapPin size={20} />
          </div>
          <address>
            {order.customerName && <strong>{order.customerName}</strong>}
            <span>{order.address || "Address not available"}</span>
            {order.colony && <span>{order.colony}</span>}
            {order.village && <span>{order.village}</span>}
            {order.pinCode && <span>PIN {order.pinCode}</span>}
            {order.phone && <span>Phone: {order.phone}</span>}
          </address>
        </section>
      </div>
    </main>
  );
}
