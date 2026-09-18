import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import "./index.css";

const base = "/blog";

function useBlogLocation() {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const relative = path.startsWith(base)
    ? path.slice(base.length) || "/"
    : path;
  const navigate = (to: string) => {
    window.location.href = `${base}${to === "/" ? "/" : to}`;
  };
  return [relative, navigate] as [string, (to: string) => void];
}

const app = (
  <StrictMode>
    <Router hook={useBlogLocation}>
      <App />
    </Router>
  </StrictMode>
);

const rootEl = document.getElementById("root");
if (rootEl?.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else if (rootEl) {
  createRoot(rootEl).render(app);
}
