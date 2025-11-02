import { useState, useEffect } from 'react';
import { SquarePenIcon} from 'lucide-react'; 
import validateProduct from './ProductValidate';
import "./ProductEditForm.css"; 
export default function ProductEditForm({ productData, onClose, onSave }) {
    const [editedProduct, setEditedProduct] = useState(productData || {
        name: '',
        description: '',
        price: '',
        category: '',
        quantity: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productData) {
            setEditedProduct(productData);
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateProduct({
        name: editedProduct.name,
        description: editedProduct.description,
        price: parseFloat(editedProduct.price.toString().replace(/,/g, "")),
        quantity: parseInt(editedProduct.quantity),
        category: editedProduct.category,
        });

        // ✅ Nếu có lỗi, hiển thị và không gọi onSave
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }

        // ✅ Nếu hợp lệ
        setErrors({});
        onSave(editedProduct);
        onClose(); 
    };

    return (
        <form onSubmit={handleSubmit} className="product-edit-form">
            
            {/* Cột Phải: Các trường nhập liệu (Để ở trên cùng cho mobile) */}
            <div className="edit-form-left-col"> 
                
                {/* Tên sản phẩm */}
                <label htmlFor="name" className="edit-form-label">Tên sản phẩm</label>
                <input 
                    id = "name"
                    type="text" 
                    name="name" 
                    value={editedProduct.name} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />
                {errors.name && <p className="error-text">{errors.name}</p>}

                {/* Mô tả sản phẩm */}
                <label htmlFor="description" className="edit-form-label">Mô tả sản phẩm</label>
                <textarea 
                    id= "description"
                    name="description" 
                    value={editedProduct.description} 
                    onChange={handleChange} 
                    className="edit-form-textarea"
                    rows="4"
                    required
                />
                {errors.description && <p className="error-text">{errors.description}</p>}

                {/* Giá sản phẩm (VNĐ) */}
                <label htmlFor="price" className="edit-form-label">Giá sản phẩm (VNĐ)</label>
                <input 
                    id="price"
                    type="number" 
                    name="price" 
                    value={editedProduct.price} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />
                {errors.price && <p className="error-text">{errors.price}</p>}

                {/* Danh mục */}
                <label htmlFor="category" className="edit-form-label">Danh mục</label>
                <input 
                    id="category"
                    type="text" 
                    name="category" 
                    value={editedProduct.category} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />
                {errors.category && <p className="error-text">{errors.category}</p>}

                {/* Số lượng tồn kho */}
                <label htmlFor="quantity" className="edit-form-label">Số lượng tồn kho</label>
                <input 
                    id="quantity"
                    type="number" 
                    name="quantity" 
                    value={editedProduct.quantity} 
                    onChange={handleChange} 
                    className="edit-form-input"
                    required
                />
            </div>
            {errors.quantity && <p className="error-text">{errors.quantity}</p>}

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
