import { SquarePenIcon, Trash2Icon } from "lucide-react";
import "./Dashboard.css";
import { useState } from "react";
import FormModel from "./FormModel";
import ProductEditForm from "./ProductEditForm";
import ProductDetailsView from "./ProductView";

export default function Dashboard() {
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const [openDetailsView, setOpenDetailsView] = useState(false); 
  const [editingProduct, setEditingProduct] = useState(null); 

  const sampleProduct = {
    id: 1,
    name: 'Điện thoại Samsung Galaxy S21',
    description: 'Tạm thời chưa có mô tả',
    price: '9,000,000',
    category: 'Điện thoại',
    stock: '15',
    imageUrl: '.'
  };

  const handleEditClick = (product) => {
    setOpenDetailsView(false);
    setEditingProduct(product); 
    setOpenFormEdit(true); 
  };

  const handleRowClick = (product) => {
    // Chỉ mở modal Details nếu modal Edit không mở
    if (!openFormEdit) {
      setEditingProduct(product);
      setOpenDetailsView(true);
    }
  }

  const handleSaveEdit = (updatedProduct) => {
    console.log("Lưu sản phẩm đã chỉnh sửa:", updatedProduct);
    setOpenFormEdit(false); 
  };
  return (
    <>
    <div className="dashboard-content">
      <input
        className="search-input"
        type="text"
        placeholder="Tìm kiếm sản phẩm ...."
      ></input>
      
      <div className="table-container">
        <table className="product-table">
          <thead className="table-header">
            <tr>
              <th className="table-head-cell">#</th>
              <th className="table-head-cell">Ảnh</th>
              <th className="table-head-cell">Tên sản phẩm</th>
              <th className="table-head-cell">Danh mục</th>
              <th className="table-head-cell">Giá</th>
              <th className="table-head-cell">Trạng thái</th>
              <th className="table-head-cell">Hành động</th>
            </tr>
          </thead>

          <tbody>
              <tr className="table-row clickable-row" // Thêm class để dễ style
                onClick={() => handleRowClick(sampleProduct)}>
                <td className="table-data-cell">1</td>
                <td className="table-data-cell">
                  {/* Sử dụng ảnh thực tế nếu có */}
                  <img src={sampleProduct.imageUrl} alt="Product" className="product-image"></img>
                </td>
                <td className="table-data-cell">{sampleProduct.name}</td>
                <td className="table-data-cell">{sampleProduct.category}</td>
                <td className="table-data-cell price-cell">{sampleProduct.price}₫</td>
                <td className="table-data-cell">
                  <span className="status-badge status-available">Còn hàng</span>
                </td>
                <td className="table-data-cell action-cell"
                    onClick={(e) => e.stopPropagation()} // <--- NGĂN CHẶN CLICK ROW KHI CLICK NÚT
                >
                  <button 
                    className="edit-button"
                    onClick={() => handleEditClick(sampleProduct)} 
                  >
                    <SquarePenIcon className="action-icon" />
                  </button>
                  <button className="delete-button">
                    <Trash2Icon className="action-icon" />
                  </button>
                </td>
              </tr>
            </tbody>
        </table>
      </div>
    </div>
     {/* Modal Sửa Sản Phẩm */}
      {openFormEdit && (
        <FormModel 
          title="Sửa sản phẩm" 
          onClose={() => setOpenFormEdit(false)}
        >
          {/* Truyền dữ liệu sản phẩm đang chỉnh sửa vào form */}
          <ProductEditForm 
            productData={editingProduct} 
            onClose={() => setOpenFormEdit(false)}
            onSave={handleSaveEdit}
          />
        </FormModel>
      )}

      {/* MODAL XEM CHI TIẾT SẢN PHẨM (MỚI) */}
      {openDetailsView && (
        <FormModel 
          title="Chi tiết sản phẩm" 
          onClose={() => setOpenDetailsView(false)}
          width="max-w-xl" 
        >
          <ProductDetailsView 
            productData={editingProduct} // Truyền dữ liệu sản phẩm đang được chọn
          />
        </FormModel>
      )}
  </>
  );
}