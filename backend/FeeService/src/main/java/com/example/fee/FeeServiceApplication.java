package com.example.fee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FeeServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(FeeServiceApplication.class, args);
    }
}
