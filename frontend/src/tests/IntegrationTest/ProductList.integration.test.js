import * as ProductApi from "../../services/ProductApi";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../../components/Dashboard";

jest.mock("../../services/ProductApi");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProductList Integration Test", () => {
  test("TC_01: Hiển thị 'Không có dữ liệu' khi API trả về mảng rỗng", async () => {
    ProductApi.getAllProduct.mockResolvedValue([]);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Không có dữ liệu/i)).toBeInTheDocument();
    });
  });

  test("TC_02: Không hiển thị sản phẩm nếu API rỗng", async () => {
    ProductApi.getAllProduct.mockResolvedValue([]);

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText("Laptop Dell")).toBeNull();
    });
  });
});
