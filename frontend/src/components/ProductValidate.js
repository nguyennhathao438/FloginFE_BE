function validateProduct(product) {
  const errors = {};
  if (!product.name || product.name.trim().length < 3) {
    errors.name = "Tên sản phẩm phải có ít nhất 3 ký tự hoặc không được để trống";
  }

  if (product.price <= 0 || product.price > 999999999) {
    errors.price = "Giá phải lớn hơn 0 hoặc nhỏ hơn 1 tỷ";
  }

  if (product.quantity <= 0 || product.quantity > 99999) {
    errors.quantity = "Số lượng không được âm hoặc nhỏ hơn 100000";
  }

  if (product.description && product.description.length > 200) {
    errors.description = "Mô tả không được quá 200 ký tự.";
  }

  const validCategories = [
    "PHONE",
    "LAPTOP",
    "TABLET",
    "TELEVISION",
    "CAMERA",
    "HEADPHONE",
    "SMART_WATCH",
    "ACCESSORY",
    "OTHER",
];
  if (!validCategories.includes(product.category)) {
    errors.category = "Danh mục không hợp lệ.";
  }

  return errors;
}

export default validateProduct;
