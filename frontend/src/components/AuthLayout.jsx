import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-container">
      <div className="auth-content-wrapper">
        <Outlet />
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
