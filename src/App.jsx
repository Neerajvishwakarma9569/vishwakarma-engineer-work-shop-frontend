import React, { Suspense, lazy } from "react";
import "./App.css";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";

// Lazy-loaded pages for faster initial site loading and smaller bundle chunks
const Products = lazy(() => import("./pages/Products"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Profile = lazy(() => import("./pages/Profile"));
const WorkerDashboard = lazy(() => import("./pages/WorkerDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/policies/RefundPolicy"));
const ReturnPolicy = lazy(() => import("./pages/policies/ReturnPolicy"));
const CancellationPolicy = lazy(() => import("./pages/policies/CancellationPolicy"));
const ShippingPolicy = lazy(() => import("./pages/policies/ShippingPolicy"));
const TermsAndConditions = lazy(() => import("./pages/policies/TermsAndConditions"));
const Disclaimer = lazy(() => import("./pages/policies/Disclaimer"));

function PageFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
        color: "#64748b",
        fontSize: "14px",
      }}
    >
      <span>Loading...</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isWorkerDashboard = location.pathname.startsWith("/worker-dashboard");

  return (
    <>
      {!isWorkerDashboard && <Navbar />}
      <Suspense fallback={<PageFallback />}>
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
      </Suspense>
      {!isWorkerDashboard && <Footer />}
    </>
  );
}
