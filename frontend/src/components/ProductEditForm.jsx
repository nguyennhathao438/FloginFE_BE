import { useState, useEffect } from 'react';
import { SquarePenIcon, UploadCloudIcon } from 'lucide-react'; // Dùng UploadCloudIcon cho "Chọn ảnh mới"
import "./ProductEditForm.css"; // Import file CSS

// Props:
// - productData: Dữ liệu sản phẩm hiện có để điền vào form
// - onClose: Hàm để đóng modal
// - onSave: Hàm để xử lý logic lưu chỉnh sửa
export default function ProductEditForm({ productData, onClose, onSave }) {
    const [editedProduct, setEditedProduct] = useState(productData || {
        name: 'Điện thoại Samsung Galaxy S21',
        description: 'Tạm thời chưa có mô tả',
        price: '9,000,000',
        category: 'Điện thoại',
        stock: '15',
        imageUrl: '.' // Giả định có ảnh preview
    });
    const [imagePreview, setImagePreview] = useState(editedProduct.imageUrl);

    // Cập nhật state nếu productData thay đổi (ví dụ: khi mở form cho sản phẩm khác)
    useEffect(() => {
        if (productData) {
            setEditedProduct(productData);
            setImagePreview(productData.imageUrl);
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // Cập nhật URL ảnh trong editedProduct nếu bạn muốn lưu vào state
                setEditedProduct(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(editedProduct); // Gọi hàm onSave từ prop
        onClose(); // Đóng modal sau khi lưu
    };

    return (
        <form onSubmit={handleSubmit} className="product-edit-form">
            
            {/* Cột Phải: Các trường nhập liệu (Để ở trên cùng cho mobile) */}
            <div className="edit-form-left-col"> {/* Tên class đảo ngược để phù hợp bố cục ảnh */}
                
                {/* Tên sản phẩm */}
                <label className="edit-form-label">Tên sản phẩm</label>
                <input 
                    type="text" 
                    name="name" 
                    value={editedProduct.name} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />

                {/* Mô tả sản phẩm */}
                <label className="edit-form-label">Mô tả sản phẩm</label>
                <textarea 
                    name="description" 
                    value={editedProduct.description} 
                    onChange={handleChange} 
                    className="edit-form-textarea"
                    rows="4" // Giảm số hàng để phù hợp với hình ảnh
                    required
                />

                {/* Giá sản phẩm (VNĐ) */}
                <label className="edit-form-label">Giá sản phẩm (VNĐ)</label>
                <input 
                    type="text" // Giữ là text để dễ hiển thị format tiền, xử lý parse khi lưu
                    name="price" 
                    value={editedProduct.price} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />

                {/* Danh mục */}
                <label className="edit-form-label">Danh mục</label>
                <input 
                    type="text" 
                    name="category" 
                    value={editedProduct.category} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />

                {/* Số lượng tồn kho */}
                <label className="edit-form-label">Số lượng tồn kho</label>
                <input 
                    type="number" 
                    name="stock" 
                    value={editedProduct.stock} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    min="0"
                    required
                />
            </div>

            {/* Cột Trái: Ảnh Preview (Để ở dưới cho mobile) */}
            <div className="edit-form-right-col"> {/* Tên class đảo ngược để phù hợp bố cục ảnh */}
                <div className="edit-image-preview-box">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Product Preview" className="edit-image-preview" />
                    ) : (
                        <span className="edit-preview-placeholder">Preview</span>
                    )}
                </div>
                
                <label htmlFor="edit-image-upload" className="edit-upload-button">
                    <UploadCloudIcon className="edit-upload-icon" /> Chọn ảnh mới
                    <input 
                        id="edit-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} 
                    />
                </label>
            </div>

            {/* Nhóm Nút Hành động */}
            <div className="edit-action-buttons-group">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="edit-cancel-button">
                    HỦY
                </button>
                <button 
                    type="submit" 
                    className="edit-submit-button">
                    <SquarePenIcon className="edit-submit-icon" /> Sửa sản phẩm
                </button>
            </div>
        </form>
    );
}
