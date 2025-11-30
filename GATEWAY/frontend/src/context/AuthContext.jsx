// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../lib/queryClient";
import apiClient from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Centralized reset routine
  const resetAppState = useCallback(() => {
    try { queryClient.clear(); } catch { }
    try { sessionStorage.clear(); } catch { }
    try { localStorage.clear(); } catch { }
    // ensure any other contexts listen to this event too
    try { window.dispatchEvent(new Event("app:reset")); } catch { }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Login
  const login = async (credentials) => {
    setLoading(true);
    setLoginError(null);
    try {
      const res = await apiClient.post("/auth/login", credentials);
      // clear stale state
      resetAppState();

      const token = res.data?.data?.token;
      const u = res.data?.data?.user;

      if (token) localStorage.setItem("auth_token", token);
      if (u) localStorage.setItem("user", JSON.stringify(u));

      setUser(u || null);
      setIsAuthenticated(!!token);
      setLoginError(null);
      navigate("/dashboard");
      return res.data;
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await apiClient.post("/auth/register", payload);
      resetAppState();

      const token = res.data?.data?.token;
      const u = res.data?.data?.user;

      if (token) localStorage.setItem("auth_token", token);
      if (u) localStorage.setItem("user", JSON.stringify(u));

      setUser(u || null);
      setIsAuthenticated(!!token);
      navigate("/dashboard");
      return res.data;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    resetAppState();
    navigate("/login");
  };

  // Keep localStorage -> state sync (in case something else updates localStorage)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          const s = e.newValue;
          setUser(s ? JSON.parse(s) : null);
          setIsAuthenticated(!!localStorage.getItem("auth_token"));
        } catch {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Expose API
  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, register, logout, loading, loginError, isLoggingIn: loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
