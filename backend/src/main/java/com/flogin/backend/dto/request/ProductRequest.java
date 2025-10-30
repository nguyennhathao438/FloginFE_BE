package com.flogin.backend.dto.request;

import com.flogin.backend.entity.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductRequest {
    int id;
    String name;
    double price;
    int quantity;
    Category category;
}
