import { SquarePenIcon, Trash2Icon } from "lucide-react";
import "./css/Dashboard.css";
import { useEffect, useState } from "react";
import FormModel from "./FormModel";
import ProductEditForm from "./ProductEditForm";
import ProductDetailsView from "./ProductView";
import {
  deleteProduct,
  getAllProduct,
  updateProduct,
} from "../services/ProductApi";

export default function Dashboard() {
  const [openFormEdit, setOpenFormEdit] = useState(false);
  const [openDetailsView, setOpenDetailsView] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async (pageNumber = 0) => {
    try {
      const result = await getAllProduct(pageNumber);

      if (!result || !result.content || result.content.length === 0) {
        setError("Không có dữ liệu");
        setProducts([]);
      } else {
        setError(null);
        setProducts(result.content);
        setPage(pageNumber);
        setTotalPages(result.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi fetch sản phẩm:", error);
      setError("Không thể tải sản phẩm");
      setProducts([]);
    }
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
  };

  const handleDelete = async (deletedProduct) => {
    try {
      const res = await deleteProduct(deletedProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletedProduct.id));
      alert("Xóa sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Không thể xóa sản phẩm. Vui lòng thử lại sau!");
    }
  };
  const handleSaveEdit = async (updatedProduct) => {
    try {
      const res = await updateProduct(updatedProduct);
      setOpenFormEdit(false);
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...res } : p))
      );
      await fetchProducts();
      alert("Cập nhật sản phẩm thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      alert("Không thể cập nhật sản phẩm. Vui lòng thử lại sau!");
    }
  };
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div className="dashboard-content">
        <input
          className="search-input"
          type="text"
          placeholder="Tìm kiếm sản phẩm ...."
          onChange={(e) => setSearch(e.target.value)}
          data-testid="search-input"
        ></input>

        <div className="table-container">
          <table className="product-table">
            <thead className="table-header">
              <tr>
                <th className="table-head-cell">#</th>
                <th className="table-head-cell">Tên sản phẩm</th>
                <th className="table-head-cell">Danh mục</th>
                <th className="table-head-cell">Giá</th>
                <th className="table-head-cell">Trạng thái</th>
                <th className="table-head-cell">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredProducts.map((products, index) => (
                  <tr
                    key={index}
                    data-testid={index}
                    className="table-row clickable-row"
                    onClick={() => handleRowClick(products)}
                  >
                    <td className="table-data-cell">{products.id}</td>
                    <td className="table-data-cell">{products.name}</td>
                    <td className="table-data-cell">{products.category}</td>
                    <td className="table-data-cell price-cell">
                      {products.price}₫
                    </td>
                    <td className="table-data-cell">
                      <span className="status-badge status-available">
                        {products.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </td>
                    <td
                      className="table-data-cell action-cell"
                      onClick={(e) => e.stopPropagation()} // <--- NGĂN CHẶN CLICK ROW KHI CLICK NÚT
                    >
                      <button
                        className="edit-button"
                        onClick={() => handleEditClick(products)}
                      >
                        <SquarePenIcon className="action-icon" />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(products)}
                      >
                        <Trash2Icon className="action-icon" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination cơ bản */}
        <div className="pagination">
          <button disabled={page <= 0} onClick={() => fetchProducts(page - 1)}>
            Prev
          </button>
          <span>{page + 1}</span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => fetchProducts(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal Sửa Sản Phẩm */}
      {openFormEdit && (
        <FormModel title="Sửa sản phẩm" onClose={() => setOpenFormEdit(false)}>
          <ProductEditForm
            productData={editingProduct}
            onClose={() => setOpenFormEdit(false)}
            onSave={handleSaveEdit}
          />
        </FormModel>
      )}

      {openDetailsView && (
        <FormModel
          title="Chi tiết sản phẩm"
          onClose={() => setOpenDetailsView(false)}
          width="max-w-xl"
        >
          <ProductDetailsView productData={editingProduct} />
        </FormModel>
      )}
    </>
  );
}
