package com.flogin.backend.security;

import com.flogin.backend.entity.User;
import com.flogin.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class ApplicationInitConfig {
    @Autowired
    UserRepository userRepository;
    //-------------------------
    //--Tu dong tao tai khoan admin khi lan dau chay app
    //-------------------------

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if(!userRepository.existsByUsername("adminhehe")){
                User user = User.builder()
                        .username("adminhehe")
                        .password("123456abc")
                        .build();
                userRepository.save(user);
                log.warn("Đã tạo tài khoản adminhehe với mật kẩu 123456abc");
            }
        };
    }

}