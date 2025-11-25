import * as ProductApi from "../../services/ProductApi";
import "@testing-library/jest-dom";

jest.mock("../../services/ProductApi");

describe("🧩 TDD - Product API Mock Testing (Full CRUD)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset mock trước mỗi test
  });

  test("TC_01 createProduct thành công", async () => {
    const mockProduct = { id: 1, name: "Laptop Dell", price: 15000000 };
    ProductApi.createProduct.mockResolvedValue(mockProduct);

    const result = await ProductApi.createProduct(mockProduct);

    expect(result).toEqual(mockProduct);
    expect(ProductApi.createProduct).toHaveBeenCalledTimes(1);
    expect(ProductApi.createProduct).toHaveBeenCalledWith(mockProduct);
  });

  test("TC_02 createProduct thất bại", async () => {
    ProductApi.createProduct.mockRejectedValue(new Error("API Error"));

    await expect(ProductApi.createProduct({})).rejects.toThrow("API Error");
    expect(ProductApi.createProduct).toHaveBeenCalledTimes(1);
  });

  test("TC_03 getAllProduct thành công", async () => {
    const mockData = [
      { id: 1, name: "Keyboard" },
      { id: 2, name: "Mouse" },
    ];
    ProductApi.getAllProduct.mockResolvedValue(mockData);

    const result = await ProductApi.getAllProduct(1);

    expect(result).toEqual(mockData);
    expect(ProductApi.getAllProduct).toHaveBeenCalledTimes(1);
    expect(ProductApi.getAllProduct).toHaveBeenCalledWith(1);
  });

  test("TC_04 getAllProduct thất bại", async () => {
    ProductApi.getAllProduct.mockRejectedValue(new Error("Server Down"));

    await expect(ProductApi.getAllProduct(1)).rejects.toThrow("Server Down");
    expect(ProductApi.getAllProduct).toHaveBeenCalledTimes(1);
  });

  test("TC_05 updateProduct thành công", async () => {
    const mockUpdated = { id: 1, name: "Laptop Dell XPS", price: 20000000 };
    ProductApi.updateProduct.mockResolvedValue(mockUpdated);

    const result = await ProductApi.updateProduct(mockUpdated);

    expect(result).toEqual(mockUpdated);
    expect(ProductApi.updateProduct).toHaveBeenCalledTimes(1);
    expect(ProductApi.updateProduct).toHaveBeenCalledWith(mockUpdated);
  });

  test("TC_06 updateProduct thất bại", async () => {
    ProductApi.updateProduct.mockRejectedValue(new Error("Update Failed"));

    await expect(ProductApi.updateProduct({})).rejects.toThrow("Update Failed");
    expect(ProductApi.updateProduct).toHaveBeenCalledTimes(1);
  });

  test("TC_07 deleteProduct thành công", async () => {
    ProductApi.deleteProduct = jest.fn().mockResolvedValue({ success: true });

    const result = await ProductApi.deleteProduct(1);

    expect(result).toEqual({ success: true });
    expect(ProductApi.deleteProduct).toHaveBeenCalledTimes(1);
    expect(ProductApi.deleteProduct).toHaveBeenCalledWith(1);
  });

  test("TC_08 deleteProduct thất bại", async () => {
    ProductApi.deleteProduct = jest
      .fn()
      .mockRejectedValue(new Error("Delete Error"));

    await expect(ProductApi.deleteProduct(99)).rejects.toThrow("Delete Error");
    expect(ProductApi.deleteProduct).toHaveBeenCalledTimes(1);
  });
});
