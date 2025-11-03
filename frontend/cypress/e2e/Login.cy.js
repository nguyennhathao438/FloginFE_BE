describe("Login E2E Test", () => {
  beforeEach(() => {
    cy.visit("/login");
  });
  it("TC1: hiển thị form login với đầy đủ các trường và nút", () => {
    cy.get('[data-testid="username-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-btn"]').should("be.visible");
  });

  it("TC2: hiện lỗi validation khi để trống hoặc nhập sai dữ liệu", () => {
    // submit form luôn khi chưa nhập gì
    cy.get('[data-testid="login-btn"]').click();

    cy.get('[data-testid="username-error"]').should("be.visible");
    cy.get('[data-testid="password-error"]').should("be.visible");

    // nhập username ngắn hơn 3 ký tự
    cy.get('[data-testid="username-input"]').type("ab");
    cy.get('[data-testid="password-input"]').type("12");

    cy.get('[data-testid="login-btn"]').click();

    cy.get('[data-testid="username-error"]').should(
      "contain.text",
      "Username phải có ít nhất 6 ký tự"
    ); // message lỗi tùy bạn cấu hình
    cy.get('[data-testid="password-error"]').should(
      "contain.text",
      "Password phải có ít nhất 6 ký tự"
    );
  });

  it("TC3: login thành công với credentials hợp lệ", () => {
    cy.on("window:alert", (text) => {
      expect(text).to.equal("Đăng nhập thành công!");
    });

    cy.get('[data-testid="username-input"]').type("adminhehe");
    cy.get('[data-testid="password-input"]').type("123456abc");
    cy.intercept("POST", "**/auth/login").as("loginReq");
    cy.get('button[type="submit"]').click();
    cy.wait("@loginReq").then((interception) => {
      cy.log(JSON.stringify(interception.response?.body));
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.get('[data-testid="login-btn"]').click();
    cy.wait(1000);
    cy.window().its("localStorage.token").should("exist");
    cy.url().should("include", "/dashboard");
  });

  it("TC4: hiện thông báo lỗi khi đăng nhập sai thông tin", () => {
    cy.get('[data-testid="username-input"]').type("wronguser");
    cy.get('[data-testid="password-input"]').type("wrongpass123");
    cy.get('[data-testid="login-btn"]').click();

    cy.get('[data-testid="message"]')
      .should("be.visible")
      .and("contain.text", "Sai tên đăng nhập hoặc mật khẩu");
  });

  it("TC5: tương tác với input đúng: focus, clear, nhập dữ liệu", () => {
    cy.get('[data-testid="username-input"]').focus().type("user1").clear();
    cy.get('[data-testid="username-input"]').should("have.value", "");

    cy.get('[data-testid="password-input"]').focus().type("pass1").clear();
    cy.get('[data-testid="password-input"]').should("have.value", "");
  });
});
