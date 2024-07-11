package com.example.nadifit.helper;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.Admin;
import com.example.nadifit.service.AdminService;
import com.example.nadifit.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailLogic {

	@Autowired
	JavaMailSender mailSender;
	
	@Autowired
	AdminService adminService;
	
	@Autowired
	UserService userService;

	public void sendMsg(String email, String otp) {
		Admin admin = adminService.adminByEmail(email);
		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);

		try {
			helper.setFrom("prajwaldurgoji16@gmail.com","Nadifit");
			helper.setTo(admin.getEmail());
			helper.setSubject("Admin Login Successful");
			helper.setText("<html><body><h1>Hello Admin</h1>"
					 + "<p>Your Otp: " + otp + "</p>"
                     + "<h2>You have logged in successfully!</h2><h3>Thanks and Regards</h3></body></html>", true);

		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (MessagingException e) {
			e.printStackTrace();
		}
		mailSender.send(message);
	}
	public void sendUserRegistrationEmail(String userEmail, String userPassword) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        try {
            helper.setFrom("prajwaldurgoji16@gmail.com", "Nadifit");
            helper.setTo(userEmail);
            helper.setSubject("Welcome to Nadifit - Your Registration Details");
            helper.setText("<html><body><h1>Hello User</h1>"
                    + "<p>Your Email is " + userEmail + "</p>"
                    + "<p>Your password: " + userPassword + "</p>"
                    + "<h2>Welcome to Nadifit! You have successfully registered.</h2>"
                    + "<h3>Thanks and Regards</h3></body></html>", true);
        } catch (UnsupportedEncodingException | MessagingException e) {
            e.printStackTrace();
        }

        mailSender.send(message);
    }
}
