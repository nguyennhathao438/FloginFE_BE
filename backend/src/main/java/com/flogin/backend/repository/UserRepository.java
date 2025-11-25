package com.flogin.backend.repository;

import com.flogin.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Integer> {
    public User findByUsername(String username);
    public boolean existsByUsername(String username);
    public void deleteByUsername(String username);
}