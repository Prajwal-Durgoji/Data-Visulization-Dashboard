package com.example.nadifit.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.nadifit.helper.EmailLogic;
import com.example.nadifit.service.AdminService;
import com.example.nadifit.service.DistributorService;
import com.example.nadifit.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Controller
public class CommonController {
	
	@Autowired
	AuthController authController;
	
	@Autowired
	AdminService adminService;
	
	@Autowired
	EmailLogic emailLogic;
	
	@Autowired
	DistributorService distributorService;
	
	@Autowired
	UserService userService;
	
//	@GetMapping("/")
//	public String loadHome() {
//		return "Home.html";
//	}
	
	@GetMapping("/")
	public String loadLogin() {
		return "Login";
	}
	
	@PostMapping("/login")
	public String signin(@RequestParam(required = false) String email,@RequestParam(required = false) String password,HttpServletRequest request,ModelMap map,HttpServletResponse response) {
		return authController.signin(email,password,request,map, response);
	}
	
	
	
	@GetMapping("/logout")
	public String logout(HttpSession session, ModelMap map) {
		session.invalidate();
		map.put("pass", "Logout Success");
		return "Login";
	}

}
