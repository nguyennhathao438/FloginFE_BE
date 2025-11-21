package com.flogin.backend.services;

import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.entity.InvalidateToken;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.InvalidateTokenRepository;
import com.flogin.backend.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthenService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InvalidateTokenRepository invalidateTokenRepository;

    private final String SIGNER_KEY = "i5n3VDtBHkxy0Bme1F23nQ6Nfxt4dBNVD4WdJ1vZKuwvJhSn7/A2CPe6bpFm7cUE";
    public LoginResponse authenticate(LoginRequest request){
        if ((request.getUsername() == null || request.getUsername().isEmpty()) &&
                (request.getPassword() == null || request.getPassword().isEmpty())) {
            throw new RuntimeException("Username va password khong duoc de trong");
        }
        if (request.getUsername() == null || request.getUsername().isEmpty()) {
            throw new RuntimeException("Username khong duoc de trong");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new RuntimeException("Password khong duoc de trong");
        }
        User user = userRepository.findByUsername(request.getUsername());
        if(user == null){
            throw new RuntimeException("Username không tồn tại");
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticate = passwordEncoder.matches(request.getPassword(),user.getPassword());
        if(!authenticate){
            throw new RuntimeException("Mật khẩu không chính xác");
        }
        String token = generateToken(user);
        LoginResponse response = LoginResponse.builder()
                .username(user.getUsername())
                .token(token)
                .isSucces(true)
                .message("Dang nhap thanh cong")
                .build();
        return response;
    }
    public String generateToken(User user) {
        if(user == null){
            throw new RuntimeException("User rỗng");
        }
        if(user.getUsername() == null || user.getUsername().isEmpty()){
            throw new RuntimeException("Không có dữ liệu username");
        }
        try {
            Date expirationTime = Date.from(Instant.now().plus(30, ChronoUnit.MINUTES));

            JWSHeader header = new JWSHeader(JWSAlgorithm.HS512); // Định nghĩa thuật toán trong Header

            JWTClaimsSet jwtClaimSet = new JWTClaimsSet.Builder()
                    .subject(user.getUsername())              // username
                    .issuer("flogin.com")                     // ai phát hành
                    .issueTime(new Date())                    // thời gian phát hành
                    .expirationTime(expirationTime)           // thời gian hết hạn
                    .jwtID(UUID.randomUUID().toString())      // id
                    .build();

            Payload payload = new Payload(jwtClaimSet.toJSONObject()); // Đóng gói payload
            JWSObject jwsObject = new JWSObject(header, payload);

            // Ký token bằng secret key
            jwsObject.sign(new MACSigner(SIGNER_KEY));

            // Trả về chuỗi token
            return jwsObject.serialize();
        } catch (JOSEException e) {
            e.printStackTrace(); // In ra lỗi để debug (có thể log ra logger)
            return null;
        }
    }
    public void logout(String token) throws ParseException, JOSEException {
        if(token == null || token.isEmpty()){
            throw new RuntimeException("token rỗng");
        }
        var signToken = verifyToken(token);
        String jid = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
        InvalidateToken invalidateToken = InvalidateToken.builder()
                .id(jid)
                .expiryTime(expiryTime)
                .build();
        invalidateTokenRepository.save(invalidateToken);
    }
    public SignedJWT verifyToken(String token) throws JOSEException, ParseException {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

            SignedJWT signedJWT = SignedJWT.parse(token);
            Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean verified = signedJWT.verify(verifier);
            if (!verified)
                throw new RuntimeException("Token không hợp lệ");
            if (!expiryTime.after(new Date()))
                throw new RuntimeException("Token đã hết hạn");
            if (invalidateTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
                throw new RuntimeException("Token đã hết hiệu lực");
            return signedJWT;
    }
}
