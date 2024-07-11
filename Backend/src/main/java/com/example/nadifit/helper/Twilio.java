package com.example.nadifit.helper;

import org.springframework.stereotype.Service;

import com.example.nadifit.dto.User;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class Twilio { 
	
	private static final String TWILIO_PHONE_NUMBER = "+13308596383";
    
    // Inside your user creation logic
    public void createUser(User user) {
        sendWelcomeSMS(user.getPhoneNumber());
    }

    public void sendWelcomeSMS(String phoneNumber) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(TWILIO_PHONE_NUMBER),
                    "Welcome to Nadifit! Your account has been created successfully."
            ).create();

            System.out.println("SMS sent with SID: " + message.getSid());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
