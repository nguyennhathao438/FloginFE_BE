import { useState } from "react";

export default function ProductForm({ mode = "create", defaultValues = {} }) {
  const [product, setProduct] = useState({
    id: defaultValues.id || "",
    name: defaultValues.name || "",
    price: defaultValues.price || "",
    quantity: defaultValues.quantity || "",
    category: defaultValues.category || "",
    description: defaultValues.description || ""
  });
  const validCategories = ["PHONE","LAPTOP","TABLET","TELEVISION","CAMERA","HEADPHONE","SMART_WATCH","ACCESSORY","OTHER"];

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "create") {
      if (!product.name.trim()) {
        setMessage("Tên sản phẩm không được để trống");
        return;
      }
      else if(!product.price && (product.price < 0 || product.price > 999999999)) {
        setMessage("Giá không được để trống và giá phải lớn hơn 0 và bé hơn 999999999");
        return;
      }
      else if(!product.quantity && (product.quantity < 0 || product.quantity > 99999)) {
        setMessage("Số lượng không được để trống hoặc số lượng lớn hơn 0 và bé hơn 99999");
        return;
      }
      else if(!product.category) {
        setMessage("sản phẩm không được để trống");
        return;
      }
      else if(!product.description) {
        setMessage("Không được để trống mô tả");
        return;
      }
      setMessage("Tạo sản phẩm thành công");
    }

    if (mode === "edit") {
    if (!product.name.trim()) {
        setMessage("Tên sản phẩm không được để trống");
        return;
    }
    else if (product.price < 0 || product.price > 99999999){
        setMessage("Giá phải lớn hơn 0 và bé hơn 999999999");
        return;
    }
    else if (product.quantity < 0 || product.quantity > 99999){
        setMessage("số lượng phải lớn hơn 0 và bé hơn 99999");
        return;
    }
    else if(!validCategories.includes(product.category)){
        setMessage("Sản phẩm không có trong danh mục");
        return;
    }
    else if(!product.description) {
        setMessage("Không được để trống mô tả");
        return;
    }
    const noChange =
    product.name === defaultValues.name &&
    Number(product.price) === Number(defaultValues.price) &&
    Number(product.quantity) === Number(defaultValues.quantity) &&
    product.category === defaultValues.category &&
    product.description === (defaultValues.description || "");

    if (noChange) {
      setMessage("Không có thay đổi nào để cập nhật");
      return;
    }

    setMessage("Cập nhật thành công");
    }
    

    if (mode === "delete") {
    if (product.id <= 0) {
      setMessage("ID không hợp lệ");
      return;
    } else if (product.id > 99999) {
      setMessage("ID vượt giới hạn cho phép");
      return;
    } else if (product.id === 999) {
      setMessage("Không tìm thấy sản phẩm cần xóa");
      return;
    }
      setMessage("Xóa sản phẩm thành công");
    }
    
    if(mode === "view"){
      setMessage("Xem chi tiết sản phẩm thành công");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {mode !== "delete" && (
        <>
          <label>
            Product Name:
            <input
              aria-label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Price:
            <input
              aria-label="Price"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
          </label>

          <label>
            Quantity:
            <input
              aria-label="Quantity"
              name="quantity"
              value={product.quantity}
              onChange={handleChange}
            />
          </label>

          <label>
            Category:
            <input
              aria-label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
            />
          </label>

          <label>
            Description:
            <textarea
              aria-label="Description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
          </label>
        </>
      )}

      {/* 🧩 Nút hành động tùy mode */}
      {mode === "create" && <button type="submit">Create</button>}
      {mode === "edit" && <button type="submit">Update</button>}
      {mode === "delete" && (
        <button type="button" onClick={handleSubmit}>
          Delete
        </button>
      )}

      {/* 🧾 Kết quả */}
      {message && <p>{message}</p>}

      {/* 🧭 View mode */}
      {mode === "view" && (
        <button type="button" onClick={handleSubmit}>
          View
          <p>{product.name}</p>
          <p>{product.price}</p>
          <p>{product.quantity}</p>
          <p>{product.category}</p>
          <p>{product.description}</p>
        </button>
      )}
    </form>
  );
}
