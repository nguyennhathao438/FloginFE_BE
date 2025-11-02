import validateProduct from "../../components/ProductValidate";

/* eslint-env jest */
describe("Product Validate Test", () => {
  test("TC1: Product name rong - nen tra ve loi", () => {
    const product = {
      name: "",
      price: 1000,
      quantity: 10,
    };
    const errors = validateProduct(product);
    expect(errors.name).toBe(
      "Tên sản phẩm phải có ít nhất 3 ký tự hoặc không được để trống"
    );
  });

  test("TC2: Price am - nen tra ve loi", () => {
    const product = {
      name: "LapTop Dell",
      price: -2,
      quantity: 5,
    };
    const errors = validateProduct(product);
    expect(errors.price).toBe("Giá phải lớn hơn 0 hoặc nhỏ hơn 1 tỷ");
  });

  test("TC3: Quantity am - nen tra ve loi", () => {
    const product = {
      name: "Laptop Asus",
      price: 2100,
      quantity: -3,
    };
    const errors = validateProduct(product);
    expect(errors.quantity).toBe("Số lượng không được âm hoặc nhỏ hơn 100000");
  });

  test("TC4: Description qua 200 ky tu - nen tra ve loi", () => {
    const longdesc = "a".repeat(201);
    const product = {
      name: "Laptop Asus",
      price: 2100,
      quantity: 5,
      description: longdesc,
    };
    const errors = validateProduct(product);
    expect(errors.description).toBe("Mô tả không được quá 200 ký tự.");
  });

  test("TC5: Category khong ton tai - nen tra ve loi", () => {
    const product = {
      name: "Laptop Asus",
      price: 2100,
      quantity: 5,
      description: "good",
      category: "Lap",
    };
    const errors = validateProduct(product);
    expect(errors.category).toBe("Danh mục không hợp lệ.");
  });
});
