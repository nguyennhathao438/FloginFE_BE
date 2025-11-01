import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import "./ProductAdd.css";

export default function ProductAdd() {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
    });
    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Product added:", product);
        console.log("Image data:", imagePreview);
    };

    const handleCancel = () => {
        // Quay lại trang danh sách hoặc xóa form
        console.log("Form cancelled.");
        setProduct({ name: '', description: '', price: '', category: '', quantity: '' });
        setImagePreview(null);
    };

    return (
        <div className="product-add-container">
            <h2 className="form-title">Thêm sản phẩm mới</h2>
            
            <form onSubmit={handleSubmit} className="product-form">
                
                {/* Cột Trái: Ảnh Preview */}
                <div className="form-left-col">
                    <div className="image-preview-box">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Product Preview" className="image-preview" />
                        ) : (
                            <span className="preview-placeholder">Preview</span>
                        )}
                    </div>
                    
                    <label htmlFor="image-upload" className="upload-button">
                        <PlusIcon className="upload-icon" /> Chọn ảnh
                        <input 
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }} 
                        />
                    </label>
                </div>

                {/* Cột Phải: Các trường nhập liệu */}
                <div className="form-right-col">
                    
                    {/* Tên sản phẩm */}
                    <label className="form-label">Tên sản phẩm</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={product.name} 
                        onChange={handleChange} 
                        placeholder="Nhập tên sản phẩm"
                        className="form-input"
                        required
                    />

                    {/* Mô tả sản phẩm */}
                    <label className="form-label">Mô tả sản phẩm</label>
                    <textarea 
                        name="description" 
                        value={product.description} 
                        onChange={handleChange} 
                        placeholder="....."
                        className="form-textarea"
                        rows="5"
                        required
                    />

                    {/* Giá sản phẩm (VNĐ) */}
                    <label className="form-label">Giá sản phẩm (VNĐ)</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={product.price} 
                        onChange={handleChange} 
                        placeholder="Nhập giá sản phẩm"
                        className="form-input"
                        min="0"
                        required
                    />

                    {/* Danh mục */}
                    <label className="form-label">Danh mục</label>
                    <input 
                        type="text" 
                        name="category" 
                        value={product.category} 
                        onChange={handleChange} 
                        placeholder="Nhập danh mục"
                        className="form-input"
                        required
                    />

                    {/* Số lượng tồn kho */}
                    <label className="form-label">Số lượng tồn kho</label>
                    <input 
                        type="number" 
                        name="quantity" 
                        value={product.quantity} 
                        onChange={handleChange} 
                        placeholder="Nhập số lượng tồn kho"
                        className="form-input"
                        min="0"
                        required
                    />

                    {/* Nhóm Nút Hành động */}
                    <div className="action-buttons-group">
                        <button 
                            type="button" 
                            onClick={handleCancel} 
                            className="cancel-button">
                            HỦY
                        </button>
                        <button 
                            type="submit" 
                            className="submit-button">
                            <PlusIcon className="submit-icon" /> Thêm sản phẩm
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}
