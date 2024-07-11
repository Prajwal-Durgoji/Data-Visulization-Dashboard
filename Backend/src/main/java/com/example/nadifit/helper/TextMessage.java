package com.example.nadifit.helper;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TextMessage {
	@Value("${smsindiahub.apiKey}")
    private String apiKey;

    @Value("${smsindiahub.senderId}")
    private String senderId;
	public String sendWelcomeSMS(String phoneNumber) {	
		try {
            // Construct the API endpoint URL with dynamic OTP
			String dynamicOTP = generateOTP();
            String message = "Welcome to the NadifitHub powered by SMSINDIAHUB. Your OTP for registration is "+dynamicOTP;
            String apiUrl = "http://cloud.smsindiahub.in/vendorsms/pushsms.aspx" +
                    "?APIKey=" + apiKey +
                    "&msisdn=" + phoneNumber +
                    "&sid=" + senderId +
                    "&msg=" + message +
                    "&fl=0&gwid=2";

            // Create a RestTemplate
            RestTemplate restTemplate = new RestTemplate();

            // Make an HTTP GET request to the SMS API
            String response = restTemplate.getForObject(apiUrl, String.class);

            // Print the API response
            System.out.println("API Response: " + response);

            return "SMS sent successfully.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to send SMS. Exception: " + e.getMessage();
        }
	}
	private static String generateOTP() {
		// Define the length of the OTP
        int otpLength = 6;

        // Define the characters allowed in the OTP
        String allowedChars = "0123456789";

        // Use StringBuilder to efficiently build the OTP
        StringBuilder otp = new StringBuilder(otpLength);

        // Use SecureRandom for secure random number generation
        SecureRandom random = new SecureRandom();

        // Generate each character of the OTP
        for (int i = 0; i < otpLength; i++) {
            int randomIndex = random.nextInt(allowedChars.length());
            otp.append(allowedChars.charAt(randomIndex));
        }
        return otp.toString();
	}
	
}
