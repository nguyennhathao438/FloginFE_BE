package com.flogin.backend.SecurityTest;

import com.flogin.backend.security.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("Cors Setup Security Test")
@TestPropertySource("/application-test.properties")
@Import(SecurityConfig.class)
@SpringBootTest
@AutoConfigureMockMvc
public class CorsTest {
    @Autowired
    private MockMvc mockMvc;
    @Test
    @DisplayName("TC1: Kiểm tra CORS headers tồn tại trong response")
    void testCorsHeadersPresent() throws Exception {
        mockMvc.perform(options("/api/auth/login")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Origin", "http://localhost:5173"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"))
                .andExpect(header().string("Access-Control-Allow-Methods", containsString("POST")))
                .andExpect(header().string("Access-Control-Allow-Credentials", "true"));

    }
}
