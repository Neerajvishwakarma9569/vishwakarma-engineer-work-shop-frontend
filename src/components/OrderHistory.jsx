import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PackageCheck,
  Truck,
  XCircle,
  FileText,
  Download,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  HelpCircle,
  Image as ImageIcon,
  DollarSign,
  ShieldCheck,
  CreditCard,
  Zap,
} from "lucide-react";
import api from "../services/api";
import { formatOrderStatus } from "../utils/orderTracking";
import InvoiceModal from "./InvoiceModal";
import "../pages/Css/MyOrders.css";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const formatDateTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time unavailable" : date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatPrice = (value) => Number(value || 0).toLocaleString("en-IN");

const latestTrackingUpdate = (order) => {
  const history = order.trackingHistory || [];
  return history[history.length - 1];
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "returns"
  const [orders, setOrders] = useState([]);
  const [cancellations, setCancellations] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Invoice modal
  const [activeInvoiceOrderId, setActiveInvoiceOrderId] = useState(null);

  // Pay Now state
  const [payingOrderId, setPayingOrderId] = useState("");

  const handlePayNow = async (order) => {
    setError("");
    setNotice("");
    setPayingOrderId(order._id);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay Checkout could not be loaded. Check your internet connection.");
      }

      const { data } = await api.post(`/orders/${order._id}/pay-now`);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Vishwakarma Engineer Workshop",
        description: `Payment for Order #${order._id.slice(-6).toUpperCase()}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            const { data: verifyData } = await api.post(`/orders/${order._id}/verify-payment`, response);
            setNotice(verifyData.message || `Payment of ₹${formatPrice(order.totalAmount)} completed successfully!`);
            await fetchHistoryData();
          } catch (vErr) {
            setError(vErr.response?.data?.message || "Payment verification failed. Please contact workshop.");
          } finally {
            setPayingOrderId("");
          }
        },
        prefill: {
          name: data.customerName || "",
          contact: data.phone || "",
          email: data.email || "",
        },
        theme: {
          color: "#d99a32",
        },
        modal: {
          ondismiss: function () {
            setPayingOrderId("");
            setNotice("Payment window closed. You can pay online anytime before delivery.");
          },
        },
      };

      const paymentWindow = new window.Razorpay(options);
      paymentWindow.on("payment.failed", function (resp) {
        setPayingOrderId("");
        setError(resp.error?.description || "Payment failed. Please try again.");
      });
      paymentWindow.open();
    } catch (err) {
      setPayingOrderId("");
      setError(err.response?.data?.message || err.message || "Could not start payment.");
    }
  };

  // Cancellation Modal state
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComments, setCancelComments] = useState("");
  const [submittingCancel, setSubmittingCancel] = useState(false);

  // Return Modal state
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [returnQuantity, setReturnQuantity] = useState(1);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [proofFiles, setProofFiles] = useState([]);
  const [proofPreviews, setProofPreviews] = useState([]);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const [ordersRes, cancelRes, returnsRes] = await Promise.allSettled([
        api.get("/orders/my"),
        api.get("/cancellations/my"),
        api.get("/returns/my"),
      ]);

      if (ordersRes.status === "fulfilled") {
        setOrders(Array.isArray(ordersRes.value.data) ? ordersRes.value.data : []);
      }
      if (cancelRes.status === "fulfilled") {
        setCancellations(Array.isArray(cancelRes.value.data) ? cancelRes.value.data : []);
      }
      if (returnsRes.status === "fulfilled") {
        setReturns(Array.isArray(returnsRes.value.data) ? returnsRes.value.data : []);
      }
    } catch {
      setError("Could not load your orders and history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const downloadInvoice = async (orderId, orderNum) => {
    try {
      const response = await api.get(`/invoices/order/${orderId}/pdf`, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice-VEW-${orderNum || orderId.slice(-6)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.alert("Could not download invoice PDF. Please try again.");
    }
  };

  // Open Cancel Modal
  const openCancelModal = (order) => {
    setCancelModalOrder(order);
    setCancelReason("Ordered by mistake");
    setCancelComments("");
    setError("");
  };

  // Submit Cancellation Request
  const handleSubmitCancellation = async (e) => {
    e.preventDefault();
    if (!cancelReason) {
      setError("Please select a cancellation reason.");
      return;
    }

    setSubmittingCancel(true);
    setError("");
    try {
      const { data } = await api.post("/cancellations", {
        orderId: cancelModalOrder._id,
        reason: cancelReason,
        comments: cancelComments,
      });

      setNotice(data.message || "Cancellation request submitted successfully.");
      setCancelModalOrder(null);
      await fetchHistoryData();
      setActiveTab("returns"); // Switch to view return/cancellation timeline
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit cancellation request.");
    } finally {
      setSubmittingCancel(false);
    }
  };

  // Open Return Modal
  const openReturnModal = (order) => {
    setReturnModalOrder(order);
    const firstProduct = order.items?.[0]?.product?._id || order.items?.[0]?.product || "";
    setSelectedProductId(firstProduct);
    setReturnQuantity(1);
    setReturnReason("Damaged Product");
    setReturnDescription("");
    setProofFiles([]);
    setProofPreviews([]);
    setError("");
  };

  // Handle proof image selection
  const handleProofFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (proofFiles.length + files.length > 5) {
      setError("You can upload a maximum of 5 proof images.");
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`File ${file.name} exceeds 5MB size limit.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setProofFiles((prev) => [...prev, ...validFiles]);
    setProofPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeProofImage = (index) => {
    setProofFiles((prev) => prev.filter((_, i) => i !== index));
    setProofPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Return Request
  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      setError("Please select a product to return.");
      return;
    }
    if (!returnReason) {
      setError("Please select a return reason.");
      return;
    }
    if (!returnDescription.trim()) {
      setError("Please describe the issue with the product.");
      return;
    }

    setSubmittingReturn(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("orderId", returnModalOrder._id);
      formData.append("productId", selectedProductId);
      formData.append("quantity", returnQuantity);
      formData.append("reason", returnReason);
      formData.append("description", returnDescription);

      proofFiles.forEach((file) => {
        formData.append("proofImages", file);
      });

      const { data } = await api.post("/returns", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNotice(data.message || "Return request submitted successfully.");
      setReturnModalOrder(null);
      await fetchHistoryData();
      setActiveTab("returns");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit return request.");
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) {
    return <p className="orders-loading" role="status">Loading your purchases and requests...</p>;
  }

  const allRequests = [
    ...cancellations.map((c) => ({ ...c, kind: "cancellation" })),
    ...returns.map((r) => ({ ...r, kind: "return" })),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="order-history">
      {/* Navigation Tabs */}
      <div className="my-orders-tabs">
        <button
          type="button"
          className={`order-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <PackageCheck size={16} />
          My Orders
          <span className="order-tab-badge">{orders.length}</span>
        </button>

        <button
          type="button"
          className={`order-tab-btn ${activeTab === "returns" ? "active" : ""}`}
          onClick={() => setActiveTab("returns")}
        >
          <RotateCcw size={16} />
          Return & Refund History
          <span className="order-tab-badge">{allRequests.length}</span>
        </button>
      </div>

      {notice && (
        <div className="policy-callout-box" role="status">
          <strong>Notice:</strong> {notice}
        </div>
      )}

      {error && (
        <p className="orders-error" role="alert">
          {error}
        </p>
      )}

      {/* TAB 1: MY ORDERS */}
      {activeTab === "orders" && (
        <>
          {orders.length ? (
            <div className="my-orders-list">
              {orders.map((order) => {
                const currentStatus = order.orderStatus || order.status || "pending";
                const isCancellable = ["pending", "confirmed"].includes(currentStatus);
                const isReturnable = ["delivered", "completed"].includes(currentStatus);

                return (
                  <article className="my-order-card" key={order._id}>
                    {latestTrackingUpdate(order) && (
                      <section className="order-tracking-notice" role="status">
                        <strong>
                          Latest update: {formatOrderStatus(latestTrackingUpdate(order).status)}
                        </strong>
                        {latestTrackingUpdate(order).message && (
                          <p>{latestTrackingUpdate(order).message}</p>
                        )}
                        <small>{formatDateTime(latestTrackingUpdate(order).updatedAt)}</small>
                      </section>
                    )}

                    <header className="my-order-header">
                      <div>
                        <span className="eyebrow">ORDER</span>
                        <h2>#{order._id.slice(-6).toUpperCase()}</h2>
                        <span className="my-order-date">Placed {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="my-order-badges">
                        <span className={`order-status status-${currentStatus}`}>
                          {formatOrderStatus(currentStatus)}
                        </span>
                        <span
                          className={`payment-status payment-${order.paymentStatus || "pending"} ${
                            order.paymentStatus === "paid" ? "payment-badge-paid" : "payment-badge-pending"
                          }`}
                        >
                          Payment {order.paymentStatus === "paid" ? "Paid ✓" : "Pending (COD)"}
                        </span>
                      </div>
                    </header>

                    <div className="my-order-items">
                      {order.items?.map((item, index) => (
                        <div className="my-order-item" key={`${item.product || item.name}-${index}`}>
                          {item.image ? (
                            <img src={item.image} alt={item.name || "Purchased product"} />
                          ) : (
                            <div className="order-item-placeholder">
                              <PackageCheck size={22} />
                            </div>
                          )}
                          <div className="my-order-item-info">
                            <b>{item.name || "Product"}</b>
                            <span>Quantity: {item.quantity}</span>
                            {item.description && <span>{item.description}</span>}
                            {(item.heightCm || item.widthCm) && (
                              <span>
                                {item.heightCm ? `Height: ${item.heightCm} cm` : ""}
                                {item.heightCm && item.widthCm ? " · " : ""}
                                {item.widthCm ? `Width: ${item.widthCm} cm` : ""}
                              </span>
                            )}
                          </div>
                          <strong>₹{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}</strong>
                        </div>
                      ))}
                    </div>

                    <footer className="my-order-footer">
                      <div>
                        <span>Delivery address: {order.address}</span>
                        <span>Phone: {order.phone}</span>
                        {order.paymentStatus === "paid" && order.razorpayPaymentId && (
                          <div style={{ marginTop: "4px", fontSize: "12px", color: "#166534", fontWeight: 600 }}>
                            ✓ Paid Online via Razorpay (ID: <span style={{ fontFamily: "monospace" }}>{order.razorpayPaymentId}</span>)
                          </div>
                        )}
                        {order.paymentStatus !== "paid" && order.status !== "cancelled" && (
                          <div style={{ marginTop: "4px", fontSize: "12px", color: "#b45309", fontWeight: 600 }}>
                            Cash on Delivery order — You can pay online anytime using the "Pay Online Now" button.
                          </div>
                        )}
                      </div>
                      <strong>Total: ₹{formatPrice(order.totalAmount)}</strong>
                    </footer>

                    <div className="my-order-actions">
                      {/* Pay Online Now Button for COD / Pending Payment */}
                      {order.paymentStatus !== "paid" && order.status !== "cancelled" && (
                        <button
                          type="button"
                          className="btn btn-pay-now"
                          disabled={payingOrderId === order._id}
                          onClick={() => handlePayNow(order)}
                          title="Pay online for this order via UPI, Google Pay, Cards, Net Banking"
                        >
                          <CreditCard size={16} />
                          {payingOrderId === order._id ? "Opening Razorpay..." : "Pay Online Now"}
                        </button>
                      )}

                      <Link className="btn btn-dark" to={`/track-order/${order._id}`}>
                        <Truck size={16} /> Track order
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => setActiveInvoiceOrderId(order._id)}
                        title="View Official Tax Invoice"
                      >
                        <FileText size={16} /> View Invoice
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => downloadInvoice(order._id, order._id.slice(-6).toUpperCase())}
                        title="Download PDF Invoice"
                      >
                        <Download size={16} /> PDF
                      </button>

                      {/* Cancel Order Action */}
                      {isCancellable && (
                        <button
                          className="btn btn-cancel"
                          type="button"
                          onClick={() => openCancelModal(order)}
                        >
                          <XCircle size={16} /> Cancel Order
                        </button>
                      )}

                      {/* Request Return / Refund Action */}
                      {isReturnable && (
                        <button
                          className="btn btn-return"
                          type="button"
                          onClick={() => openReturnModal(order)}
                        >
                          <RotateCcw size={16} /> Request Return / Refund
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <PackageCheck size={32} />
              <h3>You have no orders yet.</h3>
              <p>Once you place an order, its products will appear here.</p>
              <Link className="btn btn-dark" to="/products">
                Explore products
              </Link>
            </div>
          )}
        </>
      )}

      {/* TAB 2: RETURN & REFUND HISTORY */}
      {activeTab === "returns" && (
        <div className="history-cards-list">
          {allRequests.length ? (
            allRequests.map((req) => {
              const isReturn = req.kind === "return";
              const title = isReturn ? `Return Request #${req.requestId}` : `Cancellation Request #${req.requestId}`;
              const orderId = req.order?._id || req.order;
              const shortOrderNum = orderId ? String(orderId).slice(-6).toUpperCase() : "";

              // Determine status class
              let statusClass = "pending";
              if (["Approved", "Refund Approved"].includes(req.status)) statusClass = "approved";
              else if (["Rejected"].includes(req.status)) statusClass = "rejected";
              else if (["Refund Completed", "Completed", "Cancelled"].includes(req.status)) statusClass = "completed";

              // Timeline calculation
              const isSubmitted = true;
              const isReviewed = ["Under Review", "Approved", "Rejected", "Refund Processing", "Refund Completed", "Cancelled"].includes(req.status);
              const isApproved = ["Approved", "Refund Processing", "Refund Completed", "Cancelled"].includes(req.status);
              const isRefundProcessing = ["Refund Processing", "Refund Completed"].includes(req.status) || req.refund?.status === "Refund Processing";
              const isRefundCompleted = req.status === "Refund Completed" || req.refund?.status === "Refund Completed";
              const isRejected = req.status === "Rejected";

              return (
                <article className="history-card" key={req._id}>
                  <header className="history-card-header">
                    <div>
                      <span className="history-req-id">
                        {isReturn ? <RotateCcw size={18} color="var(--gold)" /> : <XCircle size={18} color="#e53935" />}
                        {title}
                      </span>
                      <span className="history-date">
                        Submitted on {formatDateTime(req.createdAt)} · Order #{shortOrderNum}
                      </span>
                    </div>

                    <span className={`history-status-badge status-badge-${statusClass}`}>
                      {req.status}
                    </span>
                  </header>

                  {/* Product Details */}
                  {isReturn && req.item && (
                    <div className="history-item-row">
                      {req.item.image ? (
                        <img src={req.item.image} alt={req.item.name} className="history-item-img" />
                      ) : (
                        <div className="order-item-placeholder">
                          <PackageCheck size={20} />
                        </div>
                      )}
                      <div className="history-item-details">
                        <b>{req.item.name}</b>
                        <span>Qty: {req.item.quantity} · Price: ₹{formatPrice(req.item.price)}</span>
                        <span>Reason: <strong>{req.reason}</strong></span>
                      </div>
                    </div>
                  )}

                  {!isReturn && (
                    <div className="history-item-details" style={{ marginBottom: "12px" }}>
                      <span>Cancellation Reason: <strong>{req.reason}</strong></span>
                      {req.customerNote && <span>Customer Note: {req.customerNote}</span>}
                    </div>
                  )}

                  {/* Refund Information */}
                  {req.refund && (
                    <div className="history-remarks-box">
                      <strong>Refund Status: {req.refund.status || "Pending"}</strong>
                      <span>Refund Amount: ₹{formatPrice(req.refund.amount)}</span>
                      {req.refund.razorpayRefundId && (
                        <div className="refund-ref-pill">
                          <ShieldCheck size={14} /> Razorpay Refund ID: {req.refund.razorpayRefundId}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin Remarks or Rejection Reason */}
                  {req.rejectionReason && (
                    <div className="policy-callout-box" style={{ borderColor: "#d32f2f", background: "#fdf2f2", color: "#991b1b", marginTop: "12px" }}>
                      <strong>Rejection Reason:</strong> {req.rejectionReason}
                    </div>
                  )}

                  {req.adminNotes && (
                    <div className="history-remarks-box" style={{ marginTop: "12px" }}>
                      <strong>Workshop Notes:</strong> {req.adminNotes}
                    </div>
                  )}

                  {/* Timeline UI */}
                  <div className="history-timeline">
                    <h4>Request Progress Timeline</h4>
                    <div className="timeline-steps">
                      <div className={`timeline-step ${isSubmitted ? "completed" : ""}`}>
                        <div className="timeline-step-icon">1</div>
                        <span className="timeline-step-label">Submitted</span>
                        <span className="timeline-step-date">{formatDate(req.createdAt)}</span>
                      </div>

                      <div className={`timeline-step ${isReviewed ? (isRejected ? "rejected" : "completed") : "active"}`}>
                        <div className="timeline-step-icon">2</div>
                        <span className="timeline-step-label">Admin Review</span>
                        <span className="timeline-step-date">{req.reviewedAt ? formatDate(req.reviewedAt) : "In Progress"}</span>
                      </div>

                      <div className={`timeline-step ${isRejected ? "rejected" : isApproved ? "completed" : ""}`}>
                        <div className="timeline-step-icon">3</div>
                        <span className="timeline-step-label">{isRejected ? "Rejected" : "Approved"}</span>
                        <span className="timeline-step-date">{isApproved ? "Approved" : isRejected ? "Declined" : "Pending"}</span>
                      </div>

                      <div className={`timeline-step ${isRefundProcessing ? "completed" : ""}`}>
                        <div className="timeline-step-icon">4</div>
                        <span className="timeline-step-label">Processing</span>
                        <span className="timeline-step-date">Razorpay</span>
                      </div>

                      <div className={`timeline-step ${isRefundCompleted ? "completed" : ""}`}>
                        <div className="timeline-step-icon">5</div>
                        <span className="timeline-step-label">Completed</span>
                        <span className="timeline-step-date">{isRefundCompleted ? "Refunded" : "Pending"}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="empty-state">
              <RotateCcw size={32} />
              <h3>No Return or Cancellation Requests</h3>
              <p>You have not submitted any returns or cancellation requests yet.</p>
              <button
                type="button"
                className="btn btn-dark"
                onClick={() => setActiveTab("orders")}
              >
                View Your Orders
              </button>
            </div>
          )}
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancelModalOrder && (
        <div className="modal-overlay" onClick={() => !submittingCancel && setCancelModalOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <XCircle size={20} color="#e53935" /> Cancel Order #{cancelModalOrder._id.slice(-6).toUpperCase()}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => !submittingCancel && setCancelModalOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitCancellation}>
              <div className="modal-body">
                <div className="policy-callout-box">
                  <strong>Cancellation Policy Notice:</strong> For standard items, 100% refund is initiated via Razorpay upon cancellation approval. If custom fabrication has already begun, our workshop team will review according to raw metal cutting progress.
                </div>

                <div className="form-group">
                  <label htmlFor="cancel-reason">Reason for Cancellation *</label>
                  <select
                    id="cancel-reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  >
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Incorrect dimensions or specifications provided">Incorrect dimensions or specifications provided</option>
                    <option value="Change of mind / Found alternative">Change of mind / Found alternative</option>
                    <option value="Fabrication or delivery timeline too long">Fabrication or delivery timeline too long</option>
                    <option value="Payment or billing issue">Payment or billing issue</option>
                    <option value="Other reason">Other reason</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="cancel-comments">Additional Comments / Remarks</label>
                  <textarea
                    id="cancel-comments"
                    rows={3}
                    placeholder="Provide any additional context for the workshop team..."
                    value={cancelComments}
                    onChange={(e) => setCancelComments(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={submittingCancel}
                  onClick={() => setCancelModalOrder(null)}
                >
                  Keep Order
                </button>
                <button
                  type="submit"
                  className="btn btn-cancel"
                  disabled={submittingCancel}
                >
                  {submittingCancel ? "Submitting Request..." : "Confirm Cancellation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RETURN & REFUND REQUEST MODAL */}
      {returnModalOrder && (
        <div className="modal-overlay" onClick={() => !submittingReturn && setReturnModalOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <RotateCcw size={20} color="var(--gold)" /> Return / Refund Request
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => !submittingReturn && setReturnModalOrder(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitReturn}>
              <div className="modal-body">
                <div className="policy-callout-box">
                  <strong>7-Day Return Guarantee:</strong> Returns are accepted for transit damage, manufacturing flaws, or wrong specifications received within 7 days of delivery. Upload clear photos of any damaged sections for fast approval.
                </div>

                {/* Product Selection */}
                <div className="form-group">
                  <label htmlFor="return-product">Select Product to Return *</label>
                  <select
                    id="return-product"
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    required
                  >
                    {returnModalOrder.items?.map((item) => (
                      <option key={item.product?._id || item.product} value={item.product?._id || item.product}>
                        {item.name} — ₹{formatPrice(item.price)} (Ordered: {item.quantity})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="form-group">
                  <label htmlFor="return-quantity">Quantity to Return *</label>
                  <input
                    id="return-quantity"
                    type="number"
                    min={1}
                    max={
                      returnModalOrder.items?.find(
                        (i) => (i.product?._id || i.product) === selectedProductId
                      )?.quantity || 10
                    }
                    value={returnQuantity}
                    onChange={(e) => setReturnQuantity(Number(e.target.value))}
                    required
                  />
                </div>

                {/* Reason */}
                <div className="form-group">
                  <label htmlFor="return-reason">Return Reason *</label>
                  <select
                    id="return-reason"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    required
                  >
                    <option value="Damaged Product">Damaged Product (Transit collision / dented)</option>
                    <option value="Defective Product">Defective Product (Faulty weld / joint flaw)</option>
                    <option value="Wrong Product Received">Wrong Product Received (Different design)</option>
                    <option value="Missing Parts">Missing Parts (Hinges, locks, bolts)</option>
                    <option value="Product Not as Described">Product Not as Described</option>
                    <option value="Other">Other Reason</option>
                  </select>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label htmlFor="return-desc">Description of Flaw or Issue *</label>
                  <textarea
                    id="return-desc"
                    rows={3}
                    placeholder="Describe exactly what defect or mismatch was observed upon delivery..."
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Proof Image Upload */}
                <div className="form-group">
                  <label>Upload Proof Images (Max 5 images, up to 5MB each)</label>
                  <label className="proof-upload-box" htmlFor="proof-upload-input">
                    <Upload size={24} color="var(--gold)" />
                    <p style={{ margin: "6px 0 0", fontSize: "13px", fontWeight: 600 }}>
                      Click to browse or drop photos here
                    </p>
                    <span className="form-help-text">JPG, PNG, or WEBP showing defect or damaged packaging</span>
                    <input
                      id="proof-upload-input"
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleProofFilesChange}
                    />
                  </label>

                  {proofPreviews.length > 0 && (
                    <div className="proof-previews">
                      {proofPreviews.map((src, idx) => (
                        <div className="proof-preview-item" key={idx}>
                          <img src={src} alt={`Proof preview ${idx + 1}`} />
                          <button
                            type="button"
                            className="proof-preview-remove"
                            onClick={() => removeProofImage(idx)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  disabled={submittingReturn}
                  onClick={() => setReturnModalOrder(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  disabled={submittingReturn}
                >
                  {submittingReturn ? "Uploading & Submitting..." : "Submit Return Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {activeInvoiceOrderId && (
        <InvoiceModal
          orderId={activeInvoiceOrderId}
          onClose={() => setActiveInvoiceOrderId(null)}
        />
      )}
    </div>
  );
}
