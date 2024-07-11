package com.example.nadifit.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.nadifit.dto.User;
import com.example.nadifit.dto.AdminViewOrders;
import com.example.nadifit.dto.Distributor;
import com.example.nadifit.repository.DistributorRepository;
import com.example.nadifit.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class ViewOrdersService {
	
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	DistributorRepository distributorRepository;


	public List<AdminViewOrders> getViewOrdersData() {
		List<User> users = userRepository.findAll();
		List<AdminViewOrders> viewOrdersList = new ArrayList<>();
		
		for (User user : users) {
			System.out.println(user.getName());
            AdminViewOrders adminViewOrders = new AdminViewOrders();
//            viewOrders.setUservalidate(user.getName());
//            viewOrders.setDistributorvalidate(user.getCreatedByDistributor().getName());

            viewOrdersList.add(adminViewOrders);
        }
		
		return viewOrdersList;
	}


	


	
	
}
