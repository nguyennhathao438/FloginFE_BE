import { ListIcon, LogOutIcon, PlusIcon} from "lucide-react";
import { useState } from "react";

export default function SideBar() {
  const [activeButton, setActiveButton] = useState("list");

  return (
    <div className="w-full sm:w-[150px] lg:w-[300px] bg-blue-100 h-[650px] ml-2 rounded-lg shadow-md">
      <div className="flex flex-col p-5 space-y-2">
        {/* Nút Danh sách */}
        <button
          onClick={() => setActiveButton("list")}
          className={`flex items-center gap-2 px-3 py-3 w-full rounded-md transition 
            ${activeButton === "list" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-200 text-gray-700"}`}
        >
          <ListIcon className="w-5 h-5" />
          <p className="hidden sm:block">Danh sách sản phẩm</p>
        </button>

        {/* Nút Thêm */}
        <button
          onClick={() => setActiveButton("add")}
          className={`flex items-center gap-2 px-3 py-3 w-full rounded-md transition 
            ${activeButton === "add" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-200 text-gray-700"}`}
        >
          <PlusIcon className="w-5 h-5" />
          <p className="hidden sm:block">Thêm sản phẩm</p>
        </button>

        {/* Nút Đăng xuất */}
        <button
          onClick={() => setActiveButton("logout")}
          className={`flex items-center gap-2 px-3 py-3 w-full rounded-md transition 
            ${
              activeButton === "logout" ? "bg-blue-500 text-white font-semibold" : "hover:bg-blue-200 text-gray-700"}`}>
          <LogOutIcon className="w-5 h-5" />
          <p className="hidden sm:block">xóa sản phẩm</p>
        </button>
      </div>
    </div>
  );
}
