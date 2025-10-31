package com.flogin.backend.repository;

import com.flogin.backend.entity.InvalidateToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidateTokenRepository extends JpaRepository<InvalidateToken,String> {
}
