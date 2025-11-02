import { ListIcon, LogOutIcon, PlusIcon } from "lucide-react";
import { NavLink } from "react-router-dom"; 
import "./SideBar.css";

export default function SideBar() {
  
  const getButtonClasses = ({ isActive }) => {
    const baseClasses = "sidebar-button-base";
    const activeClasses = "sidebar-button-active";
    const inactiveClasses = "sidebar-button-inactive";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-menu">
        
        <NavLink 
          to="/dashboard"
          className={getButtonClasses} 
          end // 'end' đảm bảo chỉ khớp chính xác path, không áp dụng cho route con
        >
          <ListIcon className="sidebar-icon" />
          <p className="sidebar-text">Danh sách sản phẩm</p>
        </NavLink>

        <NavLink 
          to="/add"
          className={getButtonClasses}
        >
          <PlusIcon className="sidebar-icon" />
          <p className="sidebar-text">Thêm sản phẩm</p>
        </NavLink>
        <button
          onClick={() => console.log("Thực hiện hành động xóa/đăng xuất")}
          className="sidebar-button-base sidebar-button-inactive logout-button"
        >
          <LogOutIcon className="sidebar-icon" />
          <p className="sidebar-text">Đăng xuất</p>
        </button>

      </div>
    </div>
  );
}
