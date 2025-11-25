import ProductAdd from "../../components/ProductAdd";
import ProductEditForm from "../../components/ProductEditForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as ProductApi from "../../services/ProductApi";
import validateProduct from "../../components/ProductValidate";

jest.mock("../../services/ProductApi");
jest.mock("../../components/ProductValidate");

describe("Unit test form AddProduct and UpdateProduct", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    validateProduct.mockReturnValue({});
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  test("TC_01 Success khi thêm sản phẩm hợp lệ", async () => {
    // Mock API trả về thành công
    ProductApi.createProduct.mockResolvedValueOnce({
      data: {
        id: 1,
        name: "Laptop Gaming",
      },
    });

    render(<ProductAdd />);

    // Điền form hợp lệ
    fireEvent.change(screen.getByLabelText("Tên sản phẩm"), {
      target: { value: "Laptop Gaming" },
    });
    fireEvent.change(screen.getByLabelText("Mô tả sản phẩm"), {
      target: { value: "Máy chơi game cực mạnh" },
    });
    fireEvent.change(screen.getByLabelText("Giá sản phẩm (VNĐ)"), {
      target: { value: "25000000" },
    });
    fireEvent.change(screen.getByLabelText("Danh mục"), {
      target: { value: "LAPTOP" },
    });
    fireEvent.change(screen.getByLabelText("Số lượng tồn kho"), {
      target: { value: "5" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Thêm sản phẩm/i }));

    await waitFor(() => {
      expect(ProductApi.createProduct).toHaveBeenCalledWith({
        name: "Laptop Gaming",
        description: "Máy chơi game cực mạnh",
        price: "25000000",
        category: "LAPTOP",
        quantity: "5",
      });
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Thêm sản phẩm thành công!");
    });
  });

  test("TC_02 Hiển thị alert lỗi khi createProduct bị lỗi", async () => {
    // Mock API trả về lỗi
    ProductApi.createProduct.mockRejectedValueOnce(new Error("API Error"));

    render(<ProductAdd />);

    fireEvent.change(screen.getByLabelText(/Tên sản phẩm/i), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByLabelText(/Mô tả sản phẩm/i), {
      target: { value: "Mô tả tốt" },
    });
    fireEvent.change(screen.getByLabelText(/Giá sản phẩm/i), {
      target: { value: 1000000 },
    });
    fireEvent.change(screen.getByLabelText(/Danh mục/i), {
      target: { value: "LAPTOP" },
    });
    fireEvent.change(screen.getByLabelText(/Số lượng tồn kho/i), {
      target: { value: 10 },
    });

    fireEvent.click(screen.getByRole("button", { name: /Thêm sản phẩm/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Không thể thêm sản phẩm. Vui lòng thử lại!"
      );
    });
  });

  test("Submit form thành công gọi setErrors({}), onSave và onClose", async () => {
    const onSaveMock = jest.fn();
    const onCloseMock = jest.fn();

    validateProduct.mockReturnValue({});

    const productData = {
      name: "Sản phẩm A",
      description: "Mô tả sản phẩm",
      price: 1000,
      category: "PHONE",
      quantity: 10,
    };

    render(
      <ProductEditForm
        productData={productData}
        onSave={onSaveMock}
        onClose={onCloseMock}
      />
    );

    const submitButton = screen.getByRole("button", { name: /Sửa sản phẩm/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSaveMock).toHaveBeenCalledWith(
        expect.objectContaining(productData)
      );
      expect(onCloseMock).toHaveBeenCalled();
    });

    expect(screen.queryByText(/error/i)).toBeNull();
  });
});
