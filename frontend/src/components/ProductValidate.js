export default function validateProduct(product) {
  const errors = {};
  if (product.name.trim().length < 3) {
    errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự hoặc không được để trống";
  }

  if (product.price >= 99999999) {
    errors.price = "Giá phải lớn hơn 0 hoặc nhỏ hơn 10 triệu";
  }

  if (product.quantity >= 99999) {
    errors.quantity = "Số lượng không được âm hoặc nhỏ hơn 10000";
  }

  if (product.description && product.description.length > 500) {
    errors.description = "Mô tả không được quá 500 ký tự.";
  }

  const validCategories = ["Electronics", "Books", "Clothes"];
  if (!validCategories.includes(product.category)) {
    errors.category = "Danh mục không hợp lệ.";
  }

  return errors;
}
