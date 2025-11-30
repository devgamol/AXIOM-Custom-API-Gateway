// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ApiProvider } from "./context/ApiContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ApiProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </ApiProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
