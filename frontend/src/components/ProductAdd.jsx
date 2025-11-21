import { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import "./css/ProductAdd.css";
import validateProduct from "./ProductValidate";
import { createProduct } from "../services/ProductApi";
import { useAuthStore } from "../storage/useAuthStorage";
import { useNavigate } from "react-router";
export default function ProductAdd() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProduct(product);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const newProduct = await createProduct(product);

      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        quantity: "",
      });
      setErrors({});
    } catch (error) {
      alert("Không thể thêm sản phẩm. Vui lòng thử lại!");
    }
  };

  const handleCancel = () => {
    console.log("Form cancelled.");
    setProduct({
      name: "",
      description: "",
      price: "",
      category: "",
      quantity: "",
    });
  };

  return (
    <div className="product-add-container">
      <h2 className="form-title">Thêm sản phẩm mới</h2>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Cột Phải: Các trường nhập liệu */}
        <div className="form-right-col">
          {/* Tên sản phẩm */}
          <label htmlFor="name" className="form-label">
            Tên sản phẩm
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
            className="form-input"
            required
          />
          {errors.name && (
            <p role="alert" className="error-text">
              {errors.name}
            </p>
          )}

          {/* Mô tả sản phẩm */}
          <label htmlFor="description" className="form-label">
            Mô tả sản phẩm
          </label>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="....."
            className="form-textarea"
            rows="5"
            required
          />
          {errors.description && (
            <p role="alert" className="error-text">
              {errors.description}
            </p>
          )}
          {/* Giá sản phẩm (VNĐ) */}
          <label htmlFor="price" className="form-label">
            Giá sản phẩm (VNĐ)
          </label>
          <input
            id="price"
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Nhập giá sản phẩm"
            className="form-input"
            required
          />
          {errors.price && (
            <p role="alert" className="error-text">
              {errors.price}
            </p>
          )}

          {/* Danh mục */}
          <label htmlFor="category" className="form-label">
            Danh mục
          </label>
          <select
            id="category"
            name="category"
            value={product.category}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="">-- Chọn danh mục --</option>
            <option value="PHONE">PHONE</option>
            <option value="LAPTOP">LAPTOP</option>
            <option value="TABLET">TABLET</option>
            <option value="TELEVISION">TELEVISION</option>
            <option value="CAMERA">CAMERA</option>
            <option value="HEADPHONE">HEADPHONE</option>
            <option value="SMART_WATCH">SMART WATCH</option>
            <option value="ACCESSORY">ACCESSORY</option>
            <option value="OTHER">OTHER</option>
          </select>

          {errors.category && (
            <p role="alert" className="error-text">
              {errors.category}
            </p>
          )}

          {/* Số lượng tồn kho */}
          <label htmlFor="quantity" className="form-label">
            Số lượng tồn kho
          </label>
          <input
            id="quantity"
            type="number"
            name="quantity"
            value={product.quantity}
            onChange={handleChange}
            placeholder="Nhập số lượng tồn kho"
            className="form-input"
            min="0"
            required
          />
          {errors.quantity && (
            <p role="alert" className="error-text">
              {errors.quantity}
            </p>
          )}

          {/* Nhóm Nút Hành động */}
          <div className="action-buttons-group">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              HỦY
            </button>
            <button type="submit" className="submit-button">
              <PlusIcon className="submit-icon" /> Thêm sản phẩm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
