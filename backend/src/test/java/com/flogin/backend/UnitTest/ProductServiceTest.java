package com.flogin.backend.UnitTest;

import com.flogin.backend.dto.request.ProductRequest;
import com.flogin.backend.dto.response.ProductResponse;
import com.flogin.backend.entity.Category;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import com.flogin.backend.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.TestPropertySource;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Product Service Unit Tests")
@TestPropertySource("/application-test.properties")
@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @DisplayName("TC1: Tạo sản phẩm mới thành công")
    void testCreateProduct_Success() {
        ProductRequest request = ProductRequest.builder()
                .name("Laptop")
                .price(15000000)
                .quantity(10)
                .category(Category.LAPTOP)
                .build();
        Product savedProduct = Product.builder()
                .id(1)
                .name("Laptop")
                .price(15000000)
                .quantity(10)
                .category(Category.LAPTOP)
                .build();
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
        ProductResponse result = productService.createProduct(request);
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(15000000, result.getPrice());
        assertEquals(10, result.getQuantity());
        assertEquals(Category.LAPTOP, result.getCategory());
    }

    @Test
    @DisplayName("TC2: getProduct() - Lấy sản phẩm theo ID thành công")
    void testGetProductById_Success() {
        Product product = Product.builder()
                .id(1)
                .name("Phone")
                .price(10000000)
                .quantity(5)
                .category(Category.PHONE)
                .build();
        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        ProductResponse result = productService.getProductById(1);
        assertNotNull(result);
        assertEquals("Phone", result.getName());
        assertEquals(10000000, result.getPrice());
        assertEquals(5, result.getQuantity());
        assertEquals(Category.PHONE, result.getCategory());
    }

    @Test
    @DisplayName("TC3: getProduct() - Lỗi khi không tìm thấy sản phẩm theo ID")
    void testGetProductById_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.getProductById(99);
        });
        assertEquals("Không tìm thấy sản phẩm với ID: 99", exception.getMessage());
    }


    @Test
    @DisplayName("TC4: updateProduct() - Cập nhật sản phẩm thành công")
    void testUpdateProduct_Success() {
        Product existingProduct = Product.builder()
                .id(1)
                .name("Laptop cũ")
                .price(12000000)
                .quantity(5)
                .category(Category.LAPTOP)
                .build();
        ProductRequest updateRequest = ProductRequest.builder()
                .name("Laptop mới")
                .price(17000000)
                .quantity(8)
                .category(Category.LAPTOP)
                .build();
        Product updatedProduct = Product.builder()
                .id(1)
                .name("Laptop mới")
                .price(17000000)
                .quantity(8)
                .category(Category.LAPTOP)
                .build();
        when(productRepository.findById(1)).thenReturn(Optional.of(existingProduct));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);
        ProductResponse result = productService.updateProduct(updateRequest,1);
        assertNotNull(result);
        assertEquals("Laptop mới", result.getName());
        assertEquals(17000000, result.getPrice());
        assertEquals(8, result.getQuantity());
    }

    @Test
    @DisplayName("TC5: deleteProductById() - Xóa sản phẩm theo ID thành công")
    void testDeleteProductById_Success() {
        Product existingProduct = Product.builder()
                .id(1)
                .name("Tablet")
                .price(5000000)
                .quantity(3)
                .category(Category.TABLET)
                .build();
        when(productRepository.findById(1)).thenReturn(Optional.of(existingProduct));
        doNothing().when(productRepository).delete(existingProduct);
        String result = productService.deleteProductById(1);
        assertEquals("Xóa sản phẩm thành công", result);
    }

    @Test
    @DisplayName("TC6: deleteProductById() - Ném lỗi khi sản phẩm không tồn tại")
    void testDeleteProductById_NotFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.deleteProductById(99);
        });
        assertEquals("Sản phẩm không tồn tại", exception.getMessage());
    }

    @Test
    @DisplayName("TC7: getAllProducts() - Lấy danh sách sản phẩm có phân trang")
    void testGetAllProducts_WithPagination() {
        Product p1 = Product.builder()
                .id(1)
                .name("Laptop")
                .price(15000000)
                .quantity(10)
                .category(Category.LAPTOP)
                .build();

        Product p2 = Product.builder()
                .id(2)
                .name("Phone")
                .price(8000000)
                .quantity(20)
                .category(Category.PHONE)
                .build();

        List<Product> productList = Arrays.asList(p1, p2);

        Pageable pageable = PageRequest.of(0, 2, Sort.by("id").ascending());
        Page<Product> productPage = new PageImpl<>(productList, pageable, productList.size());

        when(productRepository.findAll(pageable)).thenReturn(productPage);

        Page<ProductResponse> result = productService.getAllProduct(0, 2);

        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        assertEquals("Laptop", result.getContent().get(0).getName());
        assertEquals("Phone", result.getContent().get(1).getName());
        verify(productRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("TC8: updateProduct() - Ném lỗi khi sản phẩm không tồn tại")
    void testUpdateProduct_NotFound() {
        ProductRequest request = ProductRequest.builder()
                .name("Laptop mới")
                .price(20000000)
                .quantity(7)
                .category(Category.LAPTOP)
                .build();
        when(productRepository.findById(99)).thenReturn(Optional.empty());
        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.updateProduct(request, 99);
        });
        assertEquals("Không tìm thấy sản phẩm với ID: 99", exception.getMessage());
    }

    @Test
    @DisplayName("TC9: createProduct() - Ném lỗi khi lưu sản phẩm thất bại")
    void testCreateProduct_Failure() {
        ProductRequest request = ProductRequest.builder()
                .name("Laptop lỗi")
                .price(15000000)
                .quantity(10)
                .category(Category.LAPTOP)
                .build();

        when(productRepository.save(any(Product.class)))
                .thenThrow(new RuntimeException("Lỗi kết nối CSDL"));

        Exception exception = assertThrows(RuntimeException.class, () -> {
            productService.createProduct(request);
        });

        assertEquals("Lỗi kết nối CSDL", exception.getMessage());
    }

    @Test
    @DisplayName("TC10: createProduct() - Ném lỗi khi request null")
    void testCreateProduct_NullRequest() {
        Exception exception = assertThrows(NullPointerException.class, () -> {
            productService.createProduct(null);
        });
        assertNotNull(exception);
    }
}
