import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../../components/Dashboard";
import api from "../../services/api";
// 🧩 Mock FormModel để test dễ hơn (nếu bạn dùng portal/modal thật)
jest.mock("../../components/FormModel", () => {
  return ({ children, title, onClose }) => (
    <div data-testid="modal">
      <h2>{title}</h2>
      <button onClick={onClose}>Đóng</button>
      {children}
    </div>
  );
});
jest.mock("../../services/api");

beforeEach(() => {
  api.get.mockResolvedValue({
    data: {
      code: 200,
      result: {
        content: [
          {
            id: 52,
            name: "Laptop Dell",
            price: 15000,
            quantity: 10,
            description: "Laptop xịn xò có 1 không 2",
            category: "TABLET",
          },
        ],
      },
    },
  });
});
describe("Integration Test - Dashboard ↔ ProductDetailsView", () => {
  test(" Khi click vào sản phẩm, hiển thị modal ProductDetailsView với đúng thông tin", async () => {
    render(<Dashboard />);

    // 1️⃣ Tìm hàng đầu tiên trong bảng (tên sản phẩm)
    const productRow = await screen.findByText("Laptop Dell");
    expect(productRow).toBeInTheDocument();

    fireEvent.click(productRow);

    const modal = screen.getByTestId("modal");
    const modalUtils = within(modal);

    expect(modalUtils.getByText("Laptop Dell")).toBeInTheDocument();
    expect(
      modalUtils.getByText("Laptop xịn xò có 1 không 2")
    ).toBeInTheDocument();
    expect(modalUtils.getByText(/15000\s*VNĐ/)).toBeInTheDocument();
    expect(modalUtils.getByText("TABLET")).toBeInTheDocument();
    expect(modalUtils.getByText("10")).toBeInTheDocument();
  });

  test("TC_01 Hiển thị sai giá sản phẩm FAIL", async () => {
    render(<Dashboard />);
    const productItem = await screen.findByText("Laptop Dell");
    fireEvent.click(productItem);
    expect(screen.getByText(/15000\s*VNĐ/)).toBeInTheDocument();
  });

  test("TC_02 Hiển thị sai số lượng sản phẩm FAIL", async () => {
    render(<Dashboard />);
    const productItem = await screen.findByText("Laptop Dell");
    fireEvent.click(productItem);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("TC_03 Hiển thị sai mô tả sản phẩm FAIL", async () => {
    render(<Dashboard />);
    const productItem = await screen.findByText("Laptop Dell");
    fireEvent.click(productItem);
    expect(screen.getByText("Laptop xịn xò có 1 không 2")).toBeInTheDocument();
  });

  test("TC_04 Hiển thị sai danh mục sản phẩm FAIL", async () => {
    render(<Dashboard />);
    const productItem = await screen.findByText("Laptop Dell");
    fireEvent.click(productItem);
    const modal = screen.getByTestId("modal");
    const modalUtils = within(modal);
    expect(modalUtils.getByText("TABLET")).toBeInTheDocument();
  });
});
