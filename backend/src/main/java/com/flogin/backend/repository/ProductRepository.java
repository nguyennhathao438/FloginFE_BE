package com.flogin.backend.repository;

import com.flogin.backend.entity.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

public interface ProductRepository extends JpaRepository<Product,Integer> {
    @Transactional
    @Modifying
    public int deleteByNameStartingWith(String key);
}
