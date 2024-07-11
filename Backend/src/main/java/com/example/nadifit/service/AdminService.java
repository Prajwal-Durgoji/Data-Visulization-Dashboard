package com.example.nadifit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.Admin;
import com.example.nadifit.dto.AdminViewOrders;
import com.example.nadifit.repository.AdminRepository;
import com.example.nadifit.repository.AdminViewOrdersRepository;

@Service
public class AdminService {

	@Autowired
	private AdminRepository adminRepository;
	
	@Autowired
	private AdminViewOrdersRepository adminViewOrdersRepository;

	public boolean authenticateAdmin(String email, String password) {
		Admin admin = adminRepository.findByEmail(email);
		return admin != null && admin.getPassword().equals(password);
	}

	public void saveAdmin(Admin loggedInAdmin) {
		adminRepository.save(loggedInAdmin);

	}

	public Admin getAdminByEmail(String targetEmail) {
		return adminRepository.findByEmail(targetEmail);
	}

	public Admin adminByEmail(String email) {
		return adminRepository.findByEmail(email);
	}

	public Map<String, String> generateAndSetOtp(String email) {
		Random random = new Random();
		int otp = 1000 + random.nextInt(9000);
		String otpString = String.valueOf(otp);
		Admin admin = adminRepository.findByEmail(email);
        admin.setOtp(otpString);
        adminRepository.save(admin);

        Map<String, String> otpData = new HashMap<>();
        otpData.put("email", email);
        otpData.put("otp", otpString);

        return otpData;
	}

	public List<AdminViewOrders> getAllAdminViewOrdersByAdmin(String email) {
		return adminViewOrdersRepository.findAll();
	}
	
	
	
	
	
	

	
}
