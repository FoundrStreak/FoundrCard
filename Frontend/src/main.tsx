import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from "@/components/config/ErrorBoundary";

import "@/css/index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <Analytics />
          <App />
        </ErrorBoundary>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
