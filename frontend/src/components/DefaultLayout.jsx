import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import "./DefaultLayout.css"; 

export default function DefaultLayout() {
  return (
    <div className="layout">
    <Header/>
      <div className="layout-body">
        <SideBar />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
