package com.flogin.backend.UnitTest;

import com.flogin.backend.dto.request.ProductRequest;
import com.flogin.backend.dto.response.ProductResponse;
import com.flogin.backend.entity.Category;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.services.ProductService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@DisplayName("Product Service Unit Test")
public class ProductServiceTest {

    @Autowired
    private ProductService productService;
    @Autowired
    private ProductRepository productRepository;

    private ProductRequest buildRequest(String name) {
        return ProductRequest.builder()
                .name(name)
                .price(100.0)
                .quantity(10)
                .description("Mô tả")
                .category(Category.LAPTOP)
                .build();
    }

    @Test
    @DisplayName("TC1: Tạo sản phẩm thành công")
    void createProduct_Success() {
        var req = buildRequest("A");
        var res = productService.createProduct(req);
        assertEquals("A", res.getName());
        assertTrue(res.getId() > 0);
        assertTrue(productRepository.existsById(res.getId()));
    }

    @Test
    @DisplayName("TC2: Lấy sản phẩm thành công")
    void getProductById_Success() {
        var saved = productRepository.save(Product.builder()
                .name("B")
                .price(100.0).quantity(10)
                .description("Mô tả")
                .category(Category.LAPTOP).build());
        var res = productService.getProductById(saved.getId());
        assertEquals(saved.getName(), res.getName());
    }
    @Test
    @DisplayName("TC3: Cập nhật sản phẩm thành công")
    void updateProduct_Success() {
        var p = productRepository.save(Product.builder().name("Old").price(100.0)
                .quantity(10).description("Cũ").category(Category.LAPTOP).build());
        var req = ProductRequest.builder().name("New").price(200.0).quantity(5)
                .description("Mới").category(Category.PHONE).build();
        var res = productService.updateProduct(req, p.getId());
        assertEquals("New", res.getName());
        assertEquals(Category.PHONE, res.getCategory());
    }
    @Test
    @DisplayName("TC4: Lấy danh sáchsản phẩm thành công")
    void getProductList_Success() {
        int page = 0;
        int size =5;
        var res = productService.getAllProduct(page,size);
        assertNotNull(res);
        assertFalse(res.isEmpty());
    }
    @Test
    @DisplayName("TC5: Xóa sản phẩm thành công")
    void deleteProduct_Success() {
        var saved = productRepository.save(Product.builder()
                .name("C").price(100.0).quantity(10)
                .description("Mô tả")
                .category(Category.LAPTOP).build());
        var msg = productService.deleteProductById(saved.getId());
        assertEquals("Xóa sản phẩm thành công", msg);
assertFalse(productRepository.existsById(saved.getId()));
    }
}