describe("template spec", () => {
  before(() => {
    cy.request("POST", "http://localhost:8080/api/products/create", {
      name: "Aphone 10",
      description: "Vip max",
      price: 12000000,
      category: "PHONE",
      quantity: 10,
    });
  });
  beforeEach(() => {
    cy.visit("/dashboard");
  });
  it("TC1: hiển thị bảng danh sách sản phẩm và các nút", () => {
    cy.get('[data-testid="search-input"]').should("be.visible");
    cy.get(".table-row.clickable-row").should("exist");
    cy.get(".table-row.clickable-row")
      .its("length")
      .should("be.greaterThan", 0);
    cy.get(".edit-button").should("exist");
    cy.get(".delete-button").should("exist");
  });
  it("TC2: test thêm sản phẩm thành công", () => {
    cy.visit("/add");
    cy.get("#name").should("be.visible");
    cy.get("#description").should("be.visible");
    cy.get("#price").should("be.visible");
    cy.get("#category").should("be.visible");
    cy.get("#quantity").should("be.visible");

    cy.get("#name").type("Oppo A1K");
    cy.get("#description").type("Đời mới ram cao");
    cy.get("#price").type("19000000");
    cy.get("#category").select("PHONE");
    cy.get("#quantity").type("10");

    cy.get(".submit-button").click();

    cy.on("window:alert", (text) => {
      expect(text).to.equal("Thêm sản phẩm thành công!");
    });
  });
  it("TC3: Tìm kiếm sản phẩm", () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="search-input"]').type("Aphone 10");
    cy.get("td.table-data-cell").contains("Aphone 10").should("exist");
  });

  it("TC4: chỉnh sửa sản phẩm thành công", () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="search-input"]').clear().type("Aphone 10");
    cy.get(".edit-button").first().click();

    cy.get("#name").clear().type("Aphone 10 update");
    cy.get("#description").clear().type("Vip max update");
    cy.get("#price").clear().type("10000000");
    cy.get("#category").scrollIntoView().should("be.visible").select("PHONE");
    cy.get("#quantity").focus().type("9");

    cy.get(".edit-submit-button").click();

    cy.on("window:alert", (text) => {
      expect(text).to.equal("Cập nhật sản phẩm thành công!");
    });
  });
  it("TC5: Xóa sản phẩm thành công ", () => {
    cy.visit("/dashboard");
    cy.get('[data-testid="search-input"]').type("Aphone 10");
    cy.intercept("DELETE", "**/api/products/**").as("deleteProduct");
    cy.get(".delete-button").click();
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Xóa sản phẩm thành công!!");
    });
  });
});
