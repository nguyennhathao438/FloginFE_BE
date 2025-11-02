// src/tests/ProductEditForm.fail.test.js
import { render, screen, fireEvent } from "@testing-library/react";
import ProductEditForm from "../../components/ProductEditForm";

describe("ProductEditForm - Update Fail cases", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const productData = {
    name: "Điện thoại Samsung Galaxy S21",
    description: "Sản phẩm tốt",
    price: "9000000",
    category: "Điện thoại",
    quantity: "15",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("TC_01 FAIL khi tên sản phẩm bị để trống", () => {
    render(
      <ProductEditForm
        productData={productData}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const nameInput = screen.getByLabelText(/Tên sản phẩm/i);
    fireEvent.change(nameInput, { target: { value: " " } });

    const submitBtn = screen.getByText(/Sửa sản phẩm/i);
    fireEvent.click(submitBtn);

    // Không gọi onSave vì invalid
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("TC_02 FAIL khi giá sản phẩm âm", () => {
    render(
      <ProductEditForm
        productData={productData}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const priceInput = screen.getByLabelText(/Giá sản phẩm/i);
    fireEvent.change(priceInput, { target: { value: "-1000" } });

    const submitBtn = screen.getByText(/Sửa sản phẩm/i);
    fireEvent.click(submitBtn);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("TC_03 FAIL khi số lượng tồn kho < 0", () => {
    render(
      <ProductEditForm
        productData={productData}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const quantityInput = screen.getByLabelText(/Số lượng tồn kho/i);
    fireEvent.change(quantityInput, { target: { value: "-5" } });

    const submitBtn = screen.getByText(/Sửa sản phẩm/i);
    fireEvent.click(submitBtn);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("TC04_ FAIL khi mô tả vượt quá 200 ký tự", () => {
    render(
      <ProductEditForm
        productData={productData}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const descInput = screen.getByLabelText(/Mô tả sản phẩm/i);
    const longText = "A".repeat(250);
    fireEvent.change(descInput, { target: { value: longText } });

    const submitBtn = screen.getByText(/Sửa sản phẩm/i);
    fireEvent.click(submitBtn);

    expect(mockOnSave).not.toHaveBeenCalled();
  });
});
