package com.example.nadifit.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nadifit.dto.UserViewOrders;

public interface DistributorViewOrdersRepository extends JpaRepository<UserViewOrders, Long>{
	
}
