package com.flogin.backend.entity;

import com.flogin.backend.entity.Category;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Integer id;
    String name;
    Double price;
    int quantity;
    @Enumerated(EnumType.STRING)
    Category category;
}