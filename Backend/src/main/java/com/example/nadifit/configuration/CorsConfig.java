package com.example.nadifit.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements  WebMvcConfigurer{
	
	public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")  // Allow requests from React app
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
	
}
