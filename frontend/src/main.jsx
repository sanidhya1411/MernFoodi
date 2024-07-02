import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/Router.jsx";
import AuthProvider from "./contexts/AuthProvider.jsx";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// TanStack Query
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClickrtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"/>
    </QueryClientProvider>
  </AuthProvider>
);