import validation from "../../utils/validation";

const { validateUsername, validatePassword } = validation;

describe("Login Validate Tests", () => {
  // ---- Tests validateUsername ----
  describe("validateUsername()", () => {
    test("TC01: Username rỗng -> báo lỗi", () => {
      expect(validateUsername("")).toBe("Username không được để trống");
    });

    test("TC02: Username chỉ có khoảng trắng -> báo lỗi", () => {
      expect(validateUsername("   ")).toBe("Username không được để trống");
    });

    test("TC03: Username quá ngắn (<6 ký tự) -> báo lỗi", () => {
      expect(validateUsername("ab")).toBe("Username phải có ít nhất 6 ký tự");
    });

    test("TC04: Username quá dài (>20 ký tự) -> báo lỗi", () => {
      expect(validateUsername("a".repeat(25))).toBe(
        "Username không được vượt quá 20 ký tự"
      );
    });

    test("TC05: Username có ký tự đặc biệt -> báo lỗi", () => {
      expect(validateUsername("user@123")).toBe(
        "Username chỉ được chứa chữ, số và dấu gạch dưới"
      );
    });

    test("TC06: Username hợp lệ -> không có lỗi", () => {
      expect(validateUsername("user_123")).toBe("");
    });

    test("TC14: Username có khoảng trắng giữa -> báo lỗi", () => {
      expect(validateUsername("user name")).toBe(
        "Username chỉ được chứa chữ, số và dấu gạch dưới"
      );
    });
  });

  // ---- Tests validatePassword ----
  describe("validatePassword()", () => {
    test("TC07: Password rỗng -> báo lỗi", () => {
      expect(validatePassword("")).toBe("Password không được để trống");
    });

    test("TC08: Password chỉ có khoảng trắng -> báo lỗi", () => {
      expect(validatePassword("   ")).toBe("Password không được để trống");
    });

    test("TC09: Password quá ngắn (<6 ký tự) -> báo lỗi", () => {
      expect(validatePassword("123")).toBe("Password phải có ít nhất 6 ký tự");
    });

    test("TC10: Password quá dài (>20 ký tự) -> báo lỗi", () => {
      expect(validatePassword("a".repeat(25))).toBe(
        "Password không được vượt quá 20 ký tự"
      );
    });

    test("TC11: Password không có số -> báo lỗi", () => {
      expect(validatePassword("abcdef")).toBe(
        "Password phải chứa cả chữ và số"
      );
    });

    test("TC12: Password không có chữ -> báo lỗi", () => {
      expect(validatePassword("1234567")).toBe(
        "Password phải chứa cả chữ và số"
      );
    });

    test("TC13: Password hợp lệ -> không có lỗi", () => {
      expect(validatePassword("abc123")).toBe("");
    });

    test("TC15: Password có ký tự đặc biệt nhưng hợp lệ -> không lỗi", () => {
      expect(validatePassword("abc123!")).toBe("");
    });
  });
});
