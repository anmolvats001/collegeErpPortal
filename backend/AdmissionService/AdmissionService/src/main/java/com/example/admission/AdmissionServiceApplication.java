package com.example.admission;
import org.springframework.boot.SpringApplication; import org.springframework.boot.autoconfigure.SpringBootApplication; import org.springframework.cloud.openfeign.EnableFeignClients;
@SpringBootApplication @EnableFeignClients public class AdmissionServiceApplication { public static void main(String[] args){SpringApplication.run(AdmissionServiceApplication.class,args);} }
