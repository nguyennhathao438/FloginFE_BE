import { SquarePenIcon, Trash2Icon } from "lucide-react";
import Header from "./Header";
import SideBar from "./SideBar";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <div className="flex mt-[60px]">
        <SideBar />
        <div className="flex-1 bg-gray-100 p-6">
          <input className="text-md xl:w-[550px] lg:w-[500px] md:w-[400px] font-semibold mb-4 border-gray-500 border-2 p-1 "
            type="text"
            placeholder="Tìm kiếm sản phẩm ...."
          ></input>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-blue-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Ảnh</th>
                  <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                  <th className="py-3 px-4 text-left">Danh mục</th>
                  <th className="py-3 px-4 text-left">Giá</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-left">Hành động</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">
                    <img src="." className="rounded-full w-10 h-10 border-2 border-white object-cover">
                    </img>
                  </td>
                  <td className="py-3 px-4">Điện thoại Samsung Galaxy S21</td>
                  <td className="py-3 px-4">Điện thoại</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    9,000,000₫
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm inline-block">
                      Còn hàng
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2 lg:mt-2 md:mt-3 sm:mt-10">
                    <button className="text-blue-500 hover:text-blue-700">
                        <SquarePenIcon className="w-5 h-5"/>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                        <Trash2Icon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
