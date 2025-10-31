package com.flogin.backend.IntegrationTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.dto.request.ProductRequest;
import com.flogin.backend.entity.Category;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.security.SecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@DisplayName("Product API Integration Test")
@TestPropertySource("/test.properties")
@Import(SecurityConfig.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ProductRepository productRepository;
    @BeforeEach
    void setup() {
        if(!productRepository.existsById(1)){
        Product product = new Product();
        product.setName("MacBook Pro");
        product.setCategory(Category.LAPTOP);
        product.setPrice(50000000);
        product.setQuantity(5);
            productRepository.save(product);
        }
    }
    // 1️⃣ Create Product
    @Test
    @DisplayName("Tạo sản phẩm thành công")
    void createProduct_Success() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("iPhone 15");
        request.setCategory(Category.PHONE);
        request.setPrice(29990000);
        request.setQuantity(10);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.result.name").value("iPhone 15"));
    }

    // 2️⃣ Get Product By ID
    @Test
    @DisplayName("Lấy sản phẩm theo ID thành công")
    void getProductById_Success() throws Exception {
        mockMvc.perform(get("/api/products/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.result.id").value(1));
    }

    // 3️⃣ Get List Product (pagination)
    @Test
    @DisplayName("Lấy danh sách sản phẩm phân trang thành công")
    void getListProduct_Success() throws Exception {
        mockMvc.perform(get("/api/products")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.result.content").isArray());
    }

    // 4️⃣ Update Product
    @Test
    @DisplayName("Cập nhật sản phẩm thành công")
    void updateProduct_Success() throws Exception {
        ProductRequest request = new ProductRequest();
        request.setName("Samsung Galaxy S24");
        request.setCategory(Category.LAPTOP);
        request.setPrice(25990000);
        request.setQuantity(8);

        mockMvc.perform(put("/api/products/{id}", 1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.result.name").value("Samsung Galaxy S24"));
    }

    // 5️⃣ Delete Product
    @Test
    @DisplayName("Xóa sản phẩm thành công")
    void deleteProduct_Success() throws Exception {
        mockMvc.perform(delete("/api/products/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Xóa sản phẩm thành công"));
    }
}
