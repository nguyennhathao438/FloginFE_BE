package com.flogin.backend.UnitTest;

import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.services.AuthenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
public class LoginServiceTest {
    @InjectMocks
    private AuthenService authenService;

    @Mock
    private UserRepository userRepository;


    //Test Đăng ký thành công
    @Test
    @DisplayName("TC1 : Login thanh cong voi credential hop le")
    void testLoginSuccess(){
        LoginRequest request = new LoginRequest().builder()
                .username("admin")
                .password("123456")
                .build();
        User user = User.builder()
                .id(1)
                .username("admin")
                .password("123456")
                .build();
        when(userRepository.findByUsername(request.getUsername())).thenReturn(user);
        LoginResponse response = authenService.authenticate(request);
        assertTrue(response.isSucces());
        assertEquals("Dang nhap thanh cong",response.getMessage());
        assertNotNull(response.getToken());
    }

    @Test
    @DisplayName("TC2 : Login that bai voi username khong ton tai")
    void testLoginFailureUserNotExist(){
        LoginRequest request = new LoginRequest().builder()
                .username("khongtontai")
                .password("123456")
                .build();
        when(userRepository.findByUsername(request.getUsername())).thenReturn(null);
        LoginResponse response = authenService.authenticate(request);
        assertFalse(response.isSucces());
        assertEquals("Username khong ton tai",response.getMessage());
        assertNull(response.getToken());
    }
    @Test
    @DisplayName("TC3 : Login that bai voi password sai")
    void testLoginFailurePasswordWrong(){
        LoginRequest request = new LoginRequest().builder()
                .username("admin")
                .password("passsai")
                .build();
        User user = User.builder()
                .id(1)
                .username("admin")
                .password("123456")
                .build();
        when(userRepository.findByUsername(request.getUsername())).thenReturn(user);
        LoginResponse response = authenService.authenticate(request);
        assertFalse(response.isSucces());
        assertEquals("Mat khau khong chinh xac",response.getMessage());
        assertNull(response.getToken());
    }
    @Test
    @DisplayName("TC4 : Login error voi username null")
    void testLoginErrorUsernameNull(){
        LoginRequest request = new LoginRequest().builder()
                .username(null)
                .password("123456")
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Username khong duoc de trong",ex.getMessage());
    }
    @Test
    @DisplayName("TC5 : Login error voi password null")
    void testLoginErrorPassNull(){
        LoginRequest request = new LoginRequest().builder()
                .username("admin")
                .password(null)
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Password khong duoc de trong",ex.getMessage());
    }
    @Test
    @DisplayName("TC6 : Login error voi username va password null")
    void testLoginErrorDataNull(){
        LoginRequest request = new LoginRequest().builder()
                .username(null)
                .password(null)
                .build();
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Username va password khong duoc de trong",ex.getMessage());
    }
}
