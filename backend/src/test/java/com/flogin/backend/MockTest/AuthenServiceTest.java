package com.flogin.backend.MockTest;

import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.InvalidateTokenRepository;
import com.flogin.backend.repository.UserRepository;
import com.flogin.backend.services.AuthenService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.TestPropertySource;

import java.text.ParseException;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@TestPropertySource("/application-test.properties")
@DisplayName("Authen Service Unit Test")
@ExtendWith(MockitoExtension.class)
public class AuthenServiceTest {
    @InjectMocks
    private AuthenService authenService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private InvalidateTokenRepository invalidateTokenRepository;
    String SIGNER_KEY = "i5n3VDtBHkxy0Bme1F23nQ6Nfxt4dBNVD4WdJ1vZKuwvJhSn7/A2CPe6bpFm7cUE";

    private String generateToken(Date expiry, boolean validSignature) throws Exception {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .jwtID(UUID.randomUUID().toString())
                .subject("user123")
                .expirationTime(expiry)
                .build();
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);
        SignedJWT signedJWT = new SignedJWT(header, claims);

        byte[] key = validSignature ? SIGNER_KEY.getBytes() : "i5n3VDtBHkxy0Bme1F23nQ6NfxtestwrongJ1vZKuwvJhSn7/A2CPe6bpFm7cUE".getBytes();
        signedJWT.sign(new MACSigner(key));

        return signedJWT.serialize();
    }
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
        when(userRepository.findByUsername("admin")).thenReturn(user);
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
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Username không tồn tại",ex.getMessage());
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
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.authenticate(request));
        assertEquals("Mật khẩu không chính xác",ex.getMessage());
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
    @Test
    @DisplayName("TC7: Sinh token thành công từ user hợp lệ")
    void testGenerateTokenSuccess() {
        User user = User.builder()
                .username("admin")
                .build();
        String token = authenService.generateToken(user);
        assertNotNull(token, "Token không được null");
        assertTrue(token.contains("."), "Token phải có 3 phần được ngăn cách bằng dấu chấm");
    }
    @Test
    @DisplayName("TC8: Sinh token thất bại khi user null")
    void testGenerateTokenWithNullUser() {
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.generateToken(null));
        assertEquals("User rỗng",ex.getMessage());
    }
    @Test
    @DisplayName("TC9: Sinh token thất bại khi user null")
    void testGenerateTokenWithNullUsername() {
        User user= new User();
        RuntimeException ex = assertThrows(RuntimeException.class,()->authenService.generateToken(user));
        assertEquals("Không có dữ liệu username",ex.getMessage());
    }


    @Test
    @DisplayName("TC10: Verify token thành công")
    void testVerifyTokenSuccess() throws ParseException, JOSEException {
        User user= User.builder()
                .username("admin")
                .build();
        String token = authenService.generateToken(user);
        when(invalidateTokenRepository.existsById(anyString())).thenReturn(false);
        SignedJWT result = authenService.verifyToken(token);
        assertNotNull(result);
        assertEquals("admin", result.getJWTClaimsSet().getSubject());

    }
    @Test
    @DisplayName("TC11: Verify thất bại khi token sai chữ ký")
    void testVerifyTokenInvalidSignature() throws Exception {
        String token = generateToken(Date.from(Instant.now().plusSeconds(3600)), false);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authenService.verifyToken(token)
        );

        assertEquals("Token không hợp lệ", ex.getMessage());
    }

    @Test
    @DisplayName("TC12 :Verify thất bại khi token hết hạn")
    void testVerifyTokenExpiredToken() throws Exception {
        String token = generateToken(Date.from(Instant.now().minusSeconds(3600)), true);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authenService.verifyToken(token)
        );

        assertEquals("Token đã hết hạn", ex.getMessage());
    }

    @Test
    @DisplayName("TC13 :Verify thất bại khi token bị vô hiệu hóa trong DB")
    void testVerifyTokenRevokedToken() throws Exception {
        String token = generateToken(Date.from(Instant.now().plusSeconds(3600)), true);

        when(invalidateTokenRepository.existsById(anyString())).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                authenService.verifyToken(token)
        );

        assertEquals("Token đã hết hiệu lực", ex.getMessage());
    }
    @Test
    @DisplayName("TC14: Logout Thành công")
    void testLogoutSuccess() throws ParseException, JOSEException {
        // Mock SignedJWT và claims
        SignedJWT signedJWT = mock(SignedJWT.class);
        JWTClaimsSet claimsSet = mock(JWTClaimsSet.class);
        when(signedJWT.getJWTClaimsSet()).thenReturn(claimsSet);
        when(claimsSet.getJWTID()).thenReturn("token123");
        when(claimsSet.getExpirationTime()).thenReturn(new Date(System.currentTimeMillis() + 60000));

        // Spy service để stub verifyToken
        AuthenService spyService = spy(authenService);
        doReturn(signedJWT).when(spyService).verifyToken(anyString());

        // gọi logout
        spyService.logout("anyToken");

        // Verify repository.save được gọi với đúng token ID
        verify(invalidateTokenRepository, times(1))
                .save(argThat(inv -> "token123".equals(inv.getId())));
    }
    @Test
    @DisplayName("TC15: Logout thất bại với token null")
    void testLogoutWithTokenNull(){
        RuntimeException ex = assertThrows(RuntimeException.class,()->
                authenService.logout(null));
        assertEquals("token rỗng",ex.getMessage());
    }

}
