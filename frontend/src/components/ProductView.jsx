import { XCircleIcon } from "lucide-react";
import "./css/ProductView.css";

export default function ProductDetailsView({ productData }) {
  const data = productData || {
    name: "Sản phẩm không xác định",
    description: "Không có thông tin chi tiết.",
    price: "0",
    category: "N/A",
    quantity: "0",
    imageUrl: ".",
  };

  return (
    <div className="product-details-container">
      <div className="details-left-col">
        <div className="detail-item">
          <span className="detail-label">Tên sản phẩm:</span>
          <p className="detail-value">{data.name}</p>
        </div>

        <div className="detail-item full-width">
          <span className="detail-label">Mô tả sản phẩm:</span>
          <p className="detail-description">
            {data.description || "Tạm thời chưa có mô tả"}
          </p>
        </div>

        <div className="detail-item">
          <span className="detail-label">Giá sản phẩm:</span>
          <p className="detail-value price-value">{data.price} VNĐ</p>
        </div>

        <div className="detail-item">
          <span className="detail-label">Danh mục:</span>
          <p className="detail-value">{data.category}</p>
        </div>

        <div className="detail-item">
          <span className="detail-label">Số lượng tồn kho:</span>
          <p className="detail-value">{data.quantity}</p>
        </div>
      </div>
    </div>
  );
}
