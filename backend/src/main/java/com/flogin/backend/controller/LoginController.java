package com.flogin.backend.controller;

import com.flogin.backend.dto.request.LoginRequest;
import com.flogin.backend.dto.response.ApiResponse;
import com.flogin.backend.dto.response.LoginResponse;
import com.flogin.backend.services.AuthenService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
    @Autowired
    AuthenService authenService;
    @PostMapping("/login")
    ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authenService.authenticate(request);
                return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
                                .code(200)
                                .message("Login thành công")
                                .result(response)
                        .build());
    }
    @PostMapping("/logout")
    ResponseEntity<ApiResponse<LoginResponse>> logout(String token) throws ParseException, JOSEException {

        authenService.logout(token);
        return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
                .code(200)
                .message("Logout thành công")
                .build());
    }
}
