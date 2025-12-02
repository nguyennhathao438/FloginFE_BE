package com.flogin.backend.SecurityTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.dto.request.ProductRequest;
import com.flogin.backend.entity.Category;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.services.ProductService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@DisplayName("Product Sanitizer Test")
public class ProductSanitizerTest {
    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    private ProductRequest buildRequestJson(String name, String description) throws Exception {
        String json = "{ " +
                "\"name\": \"" + name + "\"," +
                "\"price\": 100.0," +
                "\"quantity\": 10," +
                "\"description\": \"" + description + "\"," +
                "\"category\": \"LAPTOP\"" +
                "}";
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue(json, ProductRequest.class); // Jackson sẽ gọi @JsonDeserialize
    }

    @Test
    @DisplayName("TC1: Product name và description được sanitize khi lưu")
    void productSanitizer_Success() throws Exception {
        String Name = "<script>alert('XSS')</script>MacBook Pro";
        String Description = "Mô tả <b>bold</b> <img src='x' onerror='alert(1)'>";

        ProductRequest req = buildRequestJson(Name, Description); // <-- dùng JSON

        var res = productService.createProduct(req);

        Product saved = productRepository.findById(res.getId()).orElseThrow();

        assertEquals("MacBook Pro", saved.getName(), "Tên sản phẩm chưa được sanitize");
        assertEquals("Mô tả <b>bold</b> ", saved.getDescription(), "Mô tả chưa được sanitize");
    }
    @Test
    @DisplayName("TC2: Sanitize các HTML đặc biệt")
    void productSanitizer_SpecialHtml() throws Exception {
        String Name = "<iframe src='x'></iframe>Product";
        String Description = "<a href='javascript:alert(1)'>link</a>";
        ProductRequest req = buildRequestJson(Name, Description);

        var res = productService.createProduct(req);
        Product saved = productRepository.findById(res.getId()).orElseThrow();

        assertEquals("Product", saved.getName());
        assertEquals("link", saved.getDescription());
    }
}
