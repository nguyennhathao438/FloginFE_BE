package com.flogin.backend.SecurityTest;

import com.flogin.backend.security.SecurityConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Import(SecurityConfig.class)
@TestPropertySource("/application-test.properties")
class HttpsEnforcementTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("TC1: Truy cập /api/products qua HTTP (secure=false) vẫn được phép")
    void testAccessProductsHttp() throws Exception {
        mockMvc.perform(get("/api/products").secure(false))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC2: Truy cập /api/products qua HTTPS (secure=true) được phép")
    void testAccessProductsHttps() throws Exception {
        mockMvc.perform(get("/api/products").secure(true))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("TC3: Truy cập endpoint yêu cầu auth chưa login bị từ chối")
    void testAccessPrivateEndpointWithoutAuth() throws Exception {
        // giả sử /api/private yêu cầu authenticated()
        mockMvc.perform(get("/api/private").secure(true))
                .andExpect(status().isUnauthorized()); // 401 vì chưa login
    }

    @Test
    @DisplayName("TC4: Truy cập endpoint yêu cầu auth qua HTTP chưa login bị từ chối")
    void testAccessPrivateEndpointHttp() throws Exception {
        mockMvc.perform(get("/api/private").secure(false))
                .andExpect(status().isUnauthorized()); // 401 đúng với config hiện tại
    }

}
