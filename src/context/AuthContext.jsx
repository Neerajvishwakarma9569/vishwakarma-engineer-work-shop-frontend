import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import './Css/AuthContext.css'

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("vew_token")) {
      api
        .get("/auth/me")
        .then(({ data }) => setUser(data.user))
        .catch(() => localStorage.removeItem("vew_token"))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);
  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    if (data.require2FA) {
      return data;
    }
    localStorage.setItem("vew_token", data.token);
    setUser(data.user);
    return data.user;
  };
  const verify2FA = async ({ email, otp }) => {
    const { data } = await api.post("/auth/verify-2fa", { email, otp });
    localStorage.setItem("vew_token", data.token);
    setUser(data.user);
    return data.user;
  };
  const resend2FA = async (email) => {
    const { data } = await api.post("/auth/resend-2fa", { email });
    return data;
  };
  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("vew_token", data.token);
    setUser(data.user);
    return data.user;
  };
  const resetPassword = async (payload) => {
    const { data } = await api.post("/auth/reset-password", payload);
    localStorage.setItem("vew_token", data.token);
    setUser(data.user);
    return data.user;
  };
  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/profile", payload);
    setUser(data.user);
    return data;
  };
  const logout = () => {
    localStorage.removeItem("vew_token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, verify2FA, resend2FA, register, resetPassword, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
