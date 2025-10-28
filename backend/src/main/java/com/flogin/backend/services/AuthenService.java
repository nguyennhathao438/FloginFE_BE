package com.flogin.backend.services;

import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class AuthenService {
    @Autowired
    private UserRepository userRepository;
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
            LoginResponse response = LoginResponse.builder()
                    .username(null)
                    .token(null)
                    .isSucces(false)
                    .message("Username khong ton tai")
                    .build();
            return response;
        }
        if(!user.getPassword().equals(request.getPassword())){
            LoginResponse response = LoginResponse.builder()
                    .username(null)
                    .token(null)
                    .isSucces(false)
                    .message("Mat khau khong chinh xac")
                    .build();
            return response;
        }
        String token = generateToken(user);
        LoginResponse response = LoginResponse.builder()
                .username("admin")
                .token("aloalo")
                .isSucces(true)
                .message("Dang nhap thanh cong")
                .build();
        return response;
    }
//    public String generateToken(User user) throws JOSEException {
//        Date expirationTime = Date.from(Instant.now().plus(30,ChronoUnit.MINUTES));
//
//        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512); //Định nghĩa thuật toán trong Header
//        JWTClaimsSet jwtClaimSet = new JWTClaimsSet.Builder()
//                .subject(user.getUsername())//username
//                .issuer("flogin.com")//ai phát hành ??
//                .issueTime(new Date())//thời gian phát hành
//                .expirationTime(expirationTime)//thời gian hết hạn
//                .jwtID(UUID.randomUUID().toString())//id
//                .build();
//        Payload payload = new Payload(jwtClaimSet.toJSONObject());//Đóng gói payload vào jwsobject
//        JWSObject jwsObject = new JWSObject(header,payload);
//
//                jwsObject.sign(new MACSigner("i5n3VDtBHkxy0Bme1F23nQ6Nfxt4dBNVD4WdJ1vZKuwvJhSn7/A2CPe6bpFm7cUE"));
//
//            return jwsObject.serialize();
//
//    }
}
