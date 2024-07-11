package com.example.nadifit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
public class NadifitApplication {

	public static void main(String[] args) {
		SpringApplication.run(NadifitApplication.class, args);
	}
}
 