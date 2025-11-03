package com.flogin.backend.IntegrationTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flogin.backend.UnitTest.AuthenServiceTest;
import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.security.SecurityConfig;
import com.flogin.backend.services.AuthenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Login API Integration Test")
@TestPropertySource("/test.properties")
@Import(SecurityConfig.class)
@SpringBootTest
@AutoConfigureMockMvc
public class LoginControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenService authenService;
    @BeforeEach
    void setup(){
        if(!userRepository.existsByUsername("adminhehe")) {
            User user = User.builder()
                    .username("adminhehe")
                    .password("123456abc").build();
            userRepository.save(user);
        }
    }
    @Test
    @DisplayName("INTEGRATION_BACKEND_01: POST api/auth/login thanh cong")
    void testLoginSuccess() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("adminhehe")
                .password("123456abc")
                .build();
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.succes").value(true))
                .andExpect(jsonPath("$.result.username").value("adminhehe"))
                .andExpect(jsonPath("$.result.token").isNotEmpty());;
    }
    @Test
    @DisplayName("TC2: POST api/auth/login that bai khi username null")
    void testLoginFailedWithUsernameNull() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username(null)
                .password("123456abc")
                .build();
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.message").value("Username không thể rỗng"));
    }
    @Test
    @DisplayName("TC3: POST api/auth/login that bai khi password null")
    void testLoginFailedWithPasswordNull() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("admin")
                .password(null)
                .build();
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.message").value("Password không thể rỗng"));
    }
    @Test
    @DisplayName("TC4 :POST api/auth/login that bai khi username không đúng số lượng ký tự (3-50)")
    void testLoginFailedWithUsernameIncorrectCharacters() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("ad")
                .password("123456abc")
                .build();
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.message").value("Username phải từ 3 đến 50 ký tự"));
    }
    @Test
    @DisplayName("TC5 :POST api/auth/login that bai khi username chứa ký tự đặc biệt")
    void testLoginFailedWithSpecialCharacters() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("test&*v")
                .password("123456abc")
                .build();
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.message").value("Username chỉ được chứa chữ, số, dấu chấm (.), gạch dưới (_) hoặc gạch ngang (-)"));
    }
    @Test
    @DisplayName("TC6 :POST api/auth/login that bai khi password không đủ ký tự (6-100)")
    void testLoginFailedWithPasswordIncorrectCharacters() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("admin")
                .password("2a")
                .build();
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.message").value("Password phải từ 6 đến 100 ký tự"));
    }
    @Test
    @DisplayName("TC7 :POST api/auth/login that bai khi password không đáp ứng điều kiện chỉ có chữ hoặc số")
    void testLoginFailedWithPasswordOnlyLetter() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .username("admin")
                .password("aaaaaa")
                .build();
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(1002))
                .andExpect(jsonPath("$.message").value("Password phải có ít nhất 1 chữ và 1 số"));
    }
    @Test
    @DisplayName("TC8: Kiểm tra CORS headers tồn tại trong response")
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
    @Test
    @DisplayName("TC9: Logout thành công với token hợp lệ")
    void testLogoutSuccess() throws Exception {
        User user = User.builder()
                .username("admin")
                .build();
        String token = authenService.generateToken(user);

        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", token)) // <-- gửi token qua header
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Logout thành công"));
    }

    @Test
    @DisplayName("TC10: Logout thất bại khi thiếu header Authorization")
    void testLogoutFailTokenNull() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isBadRequest());
    }
}
