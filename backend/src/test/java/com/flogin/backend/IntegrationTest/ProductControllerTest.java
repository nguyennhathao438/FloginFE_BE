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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@DisplayName("Product API Integration Test")
@TestPropertySource("/application-test.properties")
@Import(SecurityConfig.class)
@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    ObjectMapper objectMapper;
    @Autowired
    ProductRepository productRepository;

    @BeforeEach
    void setUp(){
        Product product =null;
        if(!productRepository.existsById(1)){
            product = Product.builder()
                    .name("Laptop1")
                    .price(7000000.0)
                    .quantity(1)
                    .description("Laptop xịn")
                    .category(Category.LAPTOP)
                    .build();
            productRepository.save(product);
        }
    }


    @Test
    @DisplayName("Thêm sản phẩm thành công")
    void createProduct_success() throws Exception{
        ProductRequest request = ProductRequest.builder()
                .name("Laptop2")
                .price(8000000.0)
                .quantity(1)
                .description("Laptop xịn")
                .category(Category.LAPTOP)
                .build();
        mockMvc.perform(post("/api/products/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.result.name").value("Laptop2"));
    }



    // Get Product By ID
    @Test
    @DisplayName("Lấy sản phẩm theo ID thành công")
    void getProductById_Success() throws Exception {
        mockMvc.perform(get("/api/products/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.result.id").value(1));
    }

    // Get List Product (pagination)
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

    // Update Product
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

    // Delete Product
    @Test
    @DisplayName("Xóa sản phẩm thành công")
    void deleteProduct_Success() throws Exception {
        mockMvc.perform(delete("/api/products/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Xóa sản phẩm thành công"));
    }
}
