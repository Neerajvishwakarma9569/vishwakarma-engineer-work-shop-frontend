import React from "react";
import { useLocation } from "react-router-dom";
import OrderHistory from "../components/OrderHistory";
import "./Css/MyOrders.css";

export default function MyOrders() {
  const { state } = useLocation();

  return (
    <main className="my-orders-page container section">
      <div className="page-heading">
        <span className="eyebrow">YOUR PURCHASES</span>
        <h1>My Orders</h1>
        <p>Track your orders and see the products you have purchased.</p>
      </div>
      {state?.message && <p className="notice" role="status">{state.message}</p>}
      <OrderHistory />
    </main>
  );
}
