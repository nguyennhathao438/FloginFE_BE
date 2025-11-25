package com.flogin.backend.exception;

import com.flogin.backend.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<String>> handlingValidation(MethodArgumentNotValidException exception){
        ApiResponse<String> apiResponse = new ApiResponse<>();
        apiResponse.setCode(1002);
        apiResponse.setMessage(exception.getFieldError().getDefaultMessage());
        return ResponseEntity.badRequest().body(apiResponse);
    }
    @ExceptionHandler(value = RuntimeException.class)
    ResponseEntity<ApiResponse<Object>> handlingRuntimeE(RuntimeException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ApiResponse.builder()
                        .result(null)
                        .message(ex.getMessage())
                        .code(400)
                        .build()
                );
    }
}
