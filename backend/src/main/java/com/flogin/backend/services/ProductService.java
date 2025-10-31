package com.flogin.backend.services;

import com.flogin.backend.dto.request.ProductRequest;
import com.flogin.backend.dto.response.ProductResponse;
import com.flogin.backend.entity.Product;
import com.flogin.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {
    @Autowired
    ProductRepository productRepository;public ProductResponse createProduct(ProductRequest request) {
        if (request == null) {
            throw new NullPointerException("Request không được null");
        }

        Optional<Product> existing = productRepository.findByName(request.getName());
        if (existing.isPresent()) {
            throw new RuntimeException("Sản phẩm đã tồn tại");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }

        if (request.getPrice() == null || request.getPrice() <= 0) {
            throw new IllegalArgumentException("Giá sản phẩm không hợp lệ");
        }

        if (request.getQuantity() == null || request.getQuantity() < 0) {
            throw new IllegalArgumentException("Số lượng sản phẩm không hợp lệ");
        }

        if (request.getCategory() == null) {
            throw new IllegalArgumentException("Danh mục sản phẩm không được để trống");
        }

        Product product = Product.builder()
                .name(request.getName())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .category(request.getCategory())
                .build();
        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }
    public ProductResponse getProductById(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        return mapToProductResponse(product);
    }
    public ProductResponse mapToProductResponse (Product product){
        return ProductResponse.builder()
                .id(product.getId())
                .price(product.getPrice())
                .name(product.getName())
                .quantity(product.getQuantity())
                .category(product.getCategory())
                .build();
    }
    public ProductResponse updateProduct(ProductRequest productRequest,int id){
        Product product = productRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy sản phẩm với ID: "+id));
        product.setName(productRequest.getName());
        product.setCategory(productRequest.getCategory());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        return  mapToProductResponse(productRepository.save(product));
    }

    public String deleteProductById(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));
        productRepository.delete(product);
        return "Xóa sản phẩm thành công";
    }

    //    public List<ProductResponse> getAllProduct(){
//        List<Product> products = productRepository.findAll();
//        return products.stream()
//                .map(this::mapToProductResponse)
//                .toList();
//    }
    public Page<ProductResponse> getAllProduct(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Product> productPage = productRepository.findAll(pageable);

        return productPage.map(this::mapToProductResponse);
    }
}
