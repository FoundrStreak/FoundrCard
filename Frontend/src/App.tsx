import { type FC } from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { ThemeProvider } from "@/hooks/theme-provider";
import { Toaster } from "sonner";
import { routes } from "./Route";

const AppRoutes: FC = () => useRoutes(routes);

const App: FC = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <Toaster
      position="bottom-right"
      closeButton
      richColors
      toastOptions={{
        style: {
          borderRadius: "0.65rem",
          padding: "0.75rem 1rem",
          fontWeight: 500,
          fontSize: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      }}
    />
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRoutes />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
