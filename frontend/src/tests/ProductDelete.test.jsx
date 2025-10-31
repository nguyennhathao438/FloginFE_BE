import { fireEvent, render ,screen} from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ProductForm from "../components/ProductForm";
describe('Product Delete FAIL scenarios', () => {
    // 1️⃣ Happy Path - Xóa sản phẩm hợp lệ thành công
  test("TC_DELETE_001 - Delete valid product successfully", async () => {
    render(<ProductForm mode="delete" defaultValues={{
        id: 1,
    }} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(await screen.findByText(/Xóa sản phẩm thành công/i)).toBeInTheDocument(); // ❌ FAIL (chưa có thông báo)
  });

  // 2️⃣ Negative Test - Xóa sản phẩm với dữ liệu không hợp lệ
  test("TC_DELETE_002 - Delete product with invalid ID", async () => {
    render(<ProductForm mode="delete" defaultValues={{
      id: -1,
      name: "Laptop Dell",
      price: 15000000,
      quantity: 10,
      category: "LAPTOP",
      description: "High-end Dell laptop"
    }} />);

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(await screen.findByText(/ID không hợp lệ/i))
      .toBeInTheDocument(); // ❌ FAIL
  });

  // 3️⃣ Boundary Test - Xóa sản phẩm có ID biên (min/max)
  test("TC_DELETE_003 - Delete product with boundary ID values", async () => {
    render(<ProductForm mode="delete" defaultValues={{
      id: 1, // min ID
      name: "Camera Sony",
      price: 3000000,
      quantity: 5,
      category: "CAMERA",
      description: "Compact camera"
    }} />);

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(await screen.findByText(/Xóa sản phẩm thành công/i))
      .toBeInTheDocument(); // ❌ FAIL (chưa có xử lý)
  });

  // 4️⃣ Edge Case - Xóa sản phẩm không tồn tại hoặc trùng tên
  test("TC_DELETE_004 - Delete product that does not exist", async () => {
    render(<ProductForm mode="delete" defaultValues={{
      id: 9999999, // không tồn tại
      name: "Non Existing Product",
      price: 1000000,
      quantity: 3,
      category: "PHONE",
      description: "Non existing item"
    }} />);

    fireEvent.click(screen.getByRole("button", { name: /Delete/i }));

    expect(await screen.findByText(/ID vượt giới hạn cho phép/i))
      .toBeInTheDocument(); // ❌ FAIL
  });
})