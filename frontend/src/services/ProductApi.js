import api from "./api";
export const getAllProduct = async (page) => {
  try {
    const res = await api.get("/products", {
      params: { page, size: 10 },
    });
    return {
      content: res.data.result.content,
      totalPages: res.data.result.totalPages,
      totalElements: res.data.result.totalElements,
    };
  } catch (error) {
    console.error("Lỗi khi fetch sản phẩm:", error);
  }
};
export const createProduct = async ({
  name,
  category,
  quantity,
  price,
  description,
}) => {
  try {
    const res = await api.post("/products/create", {
      name,
      category,
      quantity,
      price,
      description,
    });
    // Xóa form hoặc hiển thị thông báo
    alert("Thêm sản phẩm thành công!");
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
  }
};
export const updateProduct = async ({
  id,
  name,
  category,
  quantity,
  price,
  description,
}) => {
  try {
    const res = await api.put(`/products/${id}`, {
      name,
      category,
      quantity,
      price,
      description,
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
  }
};
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("lỗi khi xóa sản phẩm", error);
  }
};
