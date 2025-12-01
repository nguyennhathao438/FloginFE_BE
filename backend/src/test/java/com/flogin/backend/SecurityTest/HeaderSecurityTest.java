package com.flogin.backend.SecurityTest;

import com.flogin.backend.entity.User;
import com.flogin.backend.security.SecurityConfig;
import com.flogin.backend.services.AuthenService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("Header Security Test")
@TestPropertySource("/application-test.properties")
@Import(SecurityConfig.class)
@SpringBootTest
@AutoConfigureMockMvc
public class HeaderSecurityTest {
    @Autowired
    private AuthenService authenService;
    @Autowired
    private MockMvc mockMvc;
    @Test
    @DisplayName("TC1: Logout thành công với token hợp lệ")
    void testLogoutSuccess() throws Exception {
        User user = User.builder()
                .username("admin")
                .build();
        String token = authenService.generateToken(user);

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization","Bearer "+ token)) // <-- gửi token qua header
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Logout thành công"));
    }

    @Test
    @DisplayName("TC2: Logout thất bại khi thiếu header Authorization")
    void testLogoutFailTokenNull() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized());
    }
}
