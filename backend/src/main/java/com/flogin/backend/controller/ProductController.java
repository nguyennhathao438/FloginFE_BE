package com.flogin.backend.controller;

import com.flogin.backend.dto.request.ProductRequest;
import com.flogin.backend.dto.response.ApiResponse;
import com.flogin.backend.dto.response.ProductResponse;
import com.flogin.backend.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    ProductService productService;
    @PostMapping("/create")
    ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request){
        ProductResponse result = productService.createProduct(request);
        return ResponseEntity.ok(ApiResponse.<ProductResponse>builder()
                .code(201)
                        .result(result)
                        .message("Tạo sản pẩm thành công")
                .build());
    }
    @GetMapping
    ResponseEntity<ApiResponse<Page<ProductResponse>>> getListProduct(@RequestParam(defaultValue = "0")int page,
                                                                      @RequestParam(defaultValue = "10")int size){
        Page<ProductResponse> listProduct = productService.getAllProduct(page,size);
        return ResponseEntity.ok(ApiResponse.<Page<ProductResponse>>builder()
                .code(200)
                .message("Lấy danh sách sản phẩm thành công")
                .result(listProduct)
                .build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable int id,
            @RequestBody @Valid ProductRequest productRequest) {

        ProductResponse updatedProduct = productService.updateProduct(productRequest, id);

        ApiResponse<ProductResponse> response = ApiResponse.<ProductResponse>builder()
                .code(200)
                .message("Cập nhật sản phẩm thành công")
                .result(updatedProduct)
                .build();

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable int id) {
        String message = productService.deleteProductById(id);

        ApiResponse<String> response = ApiResponse.<String>builder()
                .code(200)
                .message(message)
                .build();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable int id) {
        ProductResponse product = productService.getProductById(id);

        ApiResponse<ProductResponse> response = ApiResponse.<ProductResponse>builder()
                .code(200)
                .message("Lấy thông tin sản phẩm thành công")
                .result(product)
                .build();

        return ResponseEntity.ok(response);
    }


}
