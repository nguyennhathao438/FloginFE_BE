import { fireEvent, render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ProductForm from "../components/ProductForm";
describe('ProductDelete FAIL scenarios', () => {
    test("TC_READ_001 - View product detail successfully", async () => {
    render(<ProductForm mode="read" defaultValues={{
        id: 1,
        name: "Laptop Dell",
        price: 15000000,
        quantity: 10,
        category: "LAPTOP",
        description: "Laptop Dell Inspiron"
    }} />);
    fireEvent.click(screen.getByRole('button', { name: /View/i }));
    expect(await screen.findByText(/Xem chi tiết sản phẩm thành công/i)).toBeInTheDocument(); // ❌ FAIL (chưa có logic hoặc message)

    test("TC_READ_002 - View product that does not exist", async () => {
    render(<ProductForm mode="read" defaultValues={{
        id: 9999, // id không tồn tại
    }} />);

    fireEvent.click(screen.getByRole('button', { name: /View/i }));

    expect(await screen.findByText(/Sản phẩm không tồn tại/i)).toBeInTheDocument(); // ❌ FAIL (chưa có check tồn tại)
    });

    test("TC_READ_003 - View product without ID", async () => {
    render(<ProductForm mode="read" defaultValues={{}} />);
    fireEvent.click(screen.getByRole('button', { name: /View/i }));
    expect(await screen.findByText(/Vui lòng chọn sản phẩm để xem/i)).toBeInTheDocument(); // ❌ FAIL (chưa có message này)
    });

    test("TC_READ_004 - View product with duplicate name", async () => {
    render(<ProductForm mode="read" defaultValues={{
        id: 5,
        name: "Laptop Dell" // trùng với sản phẩm khác
    }} />);
    fireEvent.click(screen.getByRole('button', { name: /View/i }));
    expect(await screen.findByText(/Phát hiện trùng tên sản phẩm/i)).toBeInTheDocument(); // ❌ FAIL (chưa có xử lý trùng tên)
    });
});

})