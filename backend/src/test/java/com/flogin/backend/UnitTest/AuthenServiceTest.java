package com.flogin.backend.UnitTest;

import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.services.AuthenService;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
@DisplayName("Authen Service Unit Test")
@SpringBootTest
@Transactional
public class AuthenServiceTest {
    @Autowired
    AuthenService authenService;
    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void setup() {
        PasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String hashedPassword = encoder.encode("123456abc");
        User user = User.builder()
                .username("usertest0123")
                .password(hashedPassword)
                .build();
        if (!userRepository.existsByUsername("usertest0123")) {
            userRepository.save(user);
        }
    }

    @AfterEach
    void delete() {
        if (userRepository.existsByUsername("usertest0123")) {
            userRepository.deleteByUsername("usertest0123");
        }
    }

    @Test
    @DisplayName("TC1: Đăng nhập thành công với credencial hợp lệ")
    void loginSuccess() {
        LoginRequest request = LoginRequest.builder()
                .username("usertest0123")
                .password("123456abc").build();
        LoginResponse response = authenService.authenticate(request);
        assertTrue(response.isSucces());
        assertEquals("Dang nhap thanh cong", response.getMessage());
        assertNotNull(response.getToken());
        assertEquals("usertest0123", response.getUsername());
    }

    @Test
    @DisplayName("TC2: Đăng nhập thất bại khi không đúng tài khoản")
    void loginFailedWithUsernameWrong(){
        LoginRequest request = LoginRequest.builder()
                .username("wrongusername")
                .password("123456abc").build();
        RuntimeException ex= assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Username không tồn tại",ex.getMessage());
    }
    @Test
    @DisplayName("T3: Đăng nhập thất bại khi không đúng mật khẩu")
    void loginFailedWithPasswordWrong(){
        LoginRequest request = LoginRequest.builder()
                .username("usertest0123")
                .password("wrongpassword").build();
        RuntimeException ex= assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Mật khẩu không chính xác",ex.getMessage());
    }
    @Test
    @DisplayName("TC4: Đăng nhập thất bại khi username và password đều null")
    void loginFailedWithUsernameAndPasswordNull() {
        LoginRequest request = LoginRequest.builder()
                .username(null)
                .password(null)
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenService.authenticate(request));
        assertEquals("Username va password khong duoc de trong", ex.getMessage());
    }

    @Test
    @DisplayName("TC5: Đăng nhập thất bại khi username là null")
    void loginFailedWithUsernameNull() {
        LoginRequest request = LoginRequest.builder()
                .username(null)
                .password("somepassword")
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenService.authenticate(request));
        assertEquals("Username khong duoc de trong", ex.getMessage());
    }

    @Test
    @DisplayName("TC6: Đăng nhập thất bại khi password là null")
    void loginFailedWithPasswordNull() {
        LoginRequest request = LoginRequest.builder()
                .username("usertest0123")
                .password(null)
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenService.authenticate(request));
        assertEquals("Password khong duoc de trong", ex.getMessage());
    }

    @Test
    @DisplayName("TC7: Đăng nhập thất bại khi username và password đều rỗng")
    void loginFailedWithUsernameAndPasswordEmpty() {
        LoginRequest request = LoginRequest.builder()
                .username("")
                .password("")
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenService.authenticate(request));
        assertEquals("Username va password khong duoc de trong", ex.getMessage());
    }

    @Test
    @DisplayName("TC8: Đăng nhập thất bại khi username là rỗng")
    void loginFailedWithUsernameEmpty() {
        LoginRequest request = LoginRequest.builder()
                .username("")
                .password("somepassword")
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenService.authenticate(request));
        assertEquals("Username khong duoc de trong", ex.getMessage());
    }

    @Test
    @DisplayName("TC9: Đăng nhập thất bại khi password là rỗng")
    void loginFailedWithPasswordEmpty() {
        LoginRequest request = LoginRequest.builder()
                .username("usertest0123")
                .password("")
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authenService.authenticate(request));
        assertEquals("Password khong duoc de trong", ex.getMessage());
    }
}
