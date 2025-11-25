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
    ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .price(productRequest.getPrice())
                .name(productRequest.getName())
                .quantity(productRequest.getQuantity())
                .description(productRequest.getDescription())
                .category(productRequest.getCategory())
                .build();
        return mapToProductResponse(productRepository.save(product));
    }

    public ProductResponse getProductById(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
        return mapToProductResponse(product);
    }

    public ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .price(product.getPrice())
                .name(product.getName())
                .quantity(product.getQuantity())
                .description(product.getDescription())
                .category(product.getCategory())
                .build();
    }
    public ProductResponse updateProduct(ProductRequest productRequest,int id){
        Product product = productRepository.findById(id).orElseThrow(()->new RuntimeException("Không tìm thấy sản phẩm với ID: "+id));
        product.setName(productRequest.getName());
        product.setCategory(productRequest.getCategory());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        product.setDescription(productRequest.getDescription());
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
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productPage = productRepository.findAll(pageable);

        return productPage.map(this::mapToProductResponse);
    }

}
