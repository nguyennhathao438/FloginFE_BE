package com.flogin.backend.SecurityTest;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

public class PasswordHashTest {

    PasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Test
    @DisplayName("TC1: Hash password thành công – hash khác password gốc")
    void testHashPasswordSuccess() {
        String raw = "123456";
        String hashed = encoder.encode(raw);

        assertNotNull(hashed);
        assertNotEquals(raw, hashed);
        assertTrue(hashed.startsWith("$2"), "BCrypt hash phải bắt đầu bằng $2");
    }

    @Test
    @DisplayName("TC2: Hash cùng 1 password nhưng hash luôn khác nhau (salt ngẫu nhiên)")
    void testHashProducesDifferentHashEachTime() {
        String raw = "123456";
        String hash1 = encoder.encode(raw);
        String hash2 = encoder.encode(raw);
        assertNotEquals(hash1, hash2,
                "BCrypt hash phải khác nhau mỗi lần vì sử dụng salt ngẫu nhiên");
    }

    @Test
    @DisplayName("TC3: matches() trả về true nếu password đúng")
    void testPasswordMatchesTrue() {
        String raw = "123456";
        String hashed = encoder.encode(raw);
        assertTrue(encoder.matches(raw, hashed));
    }

    @Test
    @DisplayName("TC4: matches() trả về false nếu password sai")
    void testPasswordMatchesFalse() {
        String raw = "123456";
        String wrong = "abcdef";
        String hashed = encoder.encode(raw);

        assertFalse(encoder.matches(wrong, hashed));
    }

    @Test
    @DisplayName("TC5: Hash password null → phải ném lỗi")
    void testHashNullPassword() {
        assertThrows(IllegalArgumentException.class, () ->
                encoder.encode(null)
        );
    }
}
