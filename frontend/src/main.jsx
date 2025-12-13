import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routers/AppRouter.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { AuthContextProvider } from "./app/providers/AuthProvider.jsx";



const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
        <ToastContainer
          position="top-right" // You can customize position
          autoClose={2000} // How long the toast stays (in ms)
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light" // "light", "dark", or "colored"
        ></ToastContainer>
      </QueryClientProvider>
    </AuthContextProvider>
  </StrictMode>
);
