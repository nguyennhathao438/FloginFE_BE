import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";

export default function DefaultLayout(){
  return (
    <>
      <Outlet/>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};
