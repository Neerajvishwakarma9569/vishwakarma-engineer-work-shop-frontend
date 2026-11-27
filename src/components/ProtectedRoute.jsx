import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Css/ProtectedRouter.css";
export default function ProtectedRoute({ children, worker = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container section">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (worker && user.role !== "worker") {
    return <Navigate to="/" replace />;
  }
  if (!worker && user.role === "worker") {
    return <Navigate to="/worker-dashboard" replace />;
  }
  return children;
}
