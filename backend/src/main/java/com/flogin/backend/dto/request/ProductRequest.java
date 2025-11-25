package com.flogin.backend.dto.request;

import com.flogin.backend.entity.Category;
import com.flogin.backend.utils.CategoryValid;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Tên sản phẩm không được rỗng")
    @Size(min = 3, max = 100, message = "Tên sản phẩm phải từ 3 đến 100 ký tự")
    String name;


    @DecimalMin(value = "0.01", message = "Giá phải lớn hơn 0")
    @DecimalMax(value = "999999999", message = "Giá không được vượt quá 999,999,999")
    double price;

    @Min(value = 0, message = "Số lượng không được nhỏ hơn 0")
    @Max(value = 99999, message = "Số lượng không được vượt quá 99,999")
    int quantity;

    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    String description;

    @NotNull(message = "Danh mục không được để trống")
    @CategoryValid
    Category category;
}
