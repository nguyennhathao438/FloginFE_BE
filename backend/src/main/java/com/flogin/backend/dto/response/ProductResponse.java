package com.flogin.backend.dto.response;

import com.flogin.backend.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    Integer id;
    String name;
    Double price;
    int quantity;
    String description;
    Category category;
}
