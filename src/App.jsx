import React from "react";
import './App.css'
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/Profile";
import WorkerDashboard from "./pages/WorkerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TrackOrder from "./pages/TrackOrder";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";
import ReturnPolicy from "./pages/policies/ReturnPolicy";
import CancellationPolicy from "./pages/policies/CancellationPolicy";
import ShippingPolicy from "./pages/policies/ShippingPolicy";
import TermsAndConditions from "./pages/policies/TermsAndConditions";
import Disclaimer from "./pages/policies/Disclaimer";

export default function App() {
  const location = useLocation();
  const isWorkerDashboard = location.pathname.startsWith("/worker-dashboard");

  return (
    <>
      {!isWorkerDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product" element={<Navigate to="/products" replace />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/product/:id" element={<Navigate to="/products/:id" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-us" element={<Navigate to="/about" replace />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact-us" element={<Navigate to="/contact" replace />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/orders" element={<Navigate to="/my-orders" replace />} />
        <Route
          path="/track-order/:id"
          element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute worker>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Policy & Legal Routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isWorkerDashboard && <Footer />}
    </>
  );
}
