package com.flogin.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LoginRequest {
    @NotBlank(message = "Username không thể rỗng")
    @Size(min = 3, max = 50, message = "Username phải từ 3 đến 50 ký tự")
    @Pattern(
            regexp = "^[a-zA-Z0-9._-]+$",
            message = "Username chỉ được chứa chữ, số, dấu chấm (.), gạch dưới (_) hoặc gạch ngang (-)"
    )
    String username;
    @NotBlank(message = "Password không thể rỗng")
    @Size(min = 6, max = 100, message = "Password phải từ 6 đến 100 ký tự")
    @Pattern(
            regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
            message = "Password phải có ít nhất 1 chữ và 1 số"
    )
    String password;
}
