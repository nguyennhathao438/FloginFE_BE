package com.flogin.backend.repository;

import com.flogin.backend.entity.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product,Integer> {

    @Transactional
    @Modifying
    public int deleteByNameStartingWith(String key);
    public void deleteByName(String name);
}
