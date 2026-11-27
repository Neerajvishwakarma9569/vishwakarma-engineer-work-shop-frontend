import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import './Css/Cart.css'

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

export default function Cart() {
  const { items, change, remove, total, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: user?.name || "",
    phone: user?.phone || "",
    pinCode: "",
    colony: "",
    village: "",
    address: "",
    paymentMethod: "online",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0,
  );
  const discount = items.reduce((sum, item) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
    return sum + lineTotal * (Number(item.discountPercent || 0) / 100);
  }, 0);
  const taxable = subtotal - discount;
  const gst = taxable * 0.18;
  const delivery = taxable * 0.05;
  const grandTotal = taxable + gst + delivery;

  const payNow = async (e) => {
    e.preventDefault();

    if (!user) return navigate("/login");
    if (!items.length) return;

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        items: items.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
        })),
        ...form,
      };
      delete payload.paymentMethod;

      if (form.paymentMethod === "cash-on-delivery") {
        const { data } = await api.post("/orders/cash-on-delivery", payload);
        clear();
        navigate("/my-orders", {
          state: {
            message: "Cash on delivery order placed successfully.",
            orderId: data._id,
          },
        });
        return;
      }

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error("Razorpay Checkout could not be loaded.");
      }

      // Create order on backend
      const { data } = await api.post("/orders/payment/create-order", payload);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Vishwakarma Engineer Workshop",
        description: "Workshop product purchase",
        order_id: data.razorpayOrderId,

        handler: async function (response) {
          try {
            // Verify payment on backend
            const { data: verification } = await api.post("/orders/payment/verify", response);

            clear();
            navigate("/my-orders", {
              state: {
                message: verification.message,
              },
            });
          } catch (error) {
            setMessage(
              error.response?.data?.message ||
                "Payment verification failed. Please contact support.",
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: user.name || "",
          email: user.email || "",
          contact: form.phone,
        },

        theme: {
          color: "#d99a32",
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            setMessage("Payment window closed. You can try again.");
          },
        },
      };

      const paymentWindow = new window.Razorpay(options);

      paymentWindow.on("payment.failed", function (response) {
        setLoading(false);
        setMessage(
          response.error?.description || "Payment failed. Please try again.",
        );
      });

      paymentWindow.open();
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Could not start payment.",
      );
    }
  };

  return (
    <main className="container section">
      <div className="page-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1>Shopping cart</h1>
      </div>

      {message && <p className="notice">{message}</p>}

      {!items.length ? (
        <div className="empty-state">
          <h3>Your cart is empty.</h3>
          <Link className="btn btn-dark" to="/products">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div className="cart-row" key={item._id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-product">
                  <b>{item.name}</b>
                  {item.category && <span className="cart-product-category">{item.category}</span>}
                  <span>₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                  {item.description && (
                    <p className="cart-product-description">{item.description}</p>
                  )}
                  {(item.heightCm || item.widthCm || item.usedMaterials?.length || item.discountPercent > 0) && (
                    <div className="cart-product-facts">
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
                      {item.discountPercent > 0 && (
                        <span>Discount: {item.discountPercent}%</span>
                      )}
                    </div>
                  )}

                  <div className="qty">
                    <button
                      type="button"
                      onClick={() => change(item._id, item.quantity - 1)}
                    >
                      -
                    </button>

                    {item.quantity}

                    <button
                      type="button"
                      onClick={() => change(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="remove"
                  onClick={() => remove(item._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <form className="form-card checkout" onSubmit={payNow}>
            <h2>Order summary</h2>

            <div className="summary-total">
              <span>Subtotal</span>
              <b>₹{subtotal.toLocaleString("en-IN")}</b>
            </div>
            <div className="summary-total">
              <span>Product discount</span>
              <b>- ₹{discount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</b>
            </div>
            <div className="summary-total">
              <span>GST (18%)</span>
              <b>₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</b>
            </div>
            <div className="summary-total">
              <span>Delivery charge (5%)</span>
              <b>₹{delivery.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</b>
            </div>
            <div className="summary-total">
              <span>Grand total</span>
              <b>₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</b>
            </div>

            <label>
              Customer full name
              <input
                required
                maxLength="180"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              />
            </label>
            <label>
              Phone number
              <input
                required
                type="tel"
                maxLength="30"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>
            <div className="two-fields">
              <label>
                PIN code
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  value={form.pinCode}
                  onChange={(e) => setForm({ ...form, pinCode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                />
              </label>
              <label>
                Colony
                <input
                  maxLength="180"
                  value={form.colony}
                  onChange={(e) => setForm({ ...form, colony: e.target.value })}
                />
              </label>
            </div>
            <label>
              Village
              <input
                maxLength="180"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
              />
            </label>

            <label>
              Delivery / project address
              <textarea
                required
                rows="3"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </label>

            <label>
              Payment option
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              >
                <option value="online">Online payment (Razorpay)</option>
                <option value="cash-on-delivery">Cash on delivery</option>
              </select>
            </label>

            <button
              type="submit"
              className="btn btn-dark full"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : form.paymentMethod === "cash-on-delivery"
                  ? "Place COD order"
                  : "Pay Now"}
            </button>

            <small>Secure payment powered by Razorpay.</small>
          </form>
        </div>
      )}
    </main>
  );
}
