import { createBrowserRouter } from "react-router-dom";
import Login from "./Login";
import DefaultLayout from "./DefaultLayout";
import Dashboard from "./Dashboard";
import ProductAdd from "./ProductAdd";
import Register from "./register";
import AuthLayout from "./AuthLayout";
const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register", // Đặt path là "/register" hoặc "register"
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
        index: true,
      },
      {
        path: "add",
        element: <ProductAdd />,
      },
    ],
  },
]);

export default router;
