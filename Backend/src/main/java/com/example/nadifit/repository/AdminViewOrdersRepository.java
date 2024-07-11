package com.example.nadifit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.nadifit.dto.AdminViewOrders;

public interface AdminViewOrdersRepository extends JpaRepository<AdminViewOrders, Long> {

	List<AdminViewOrders> findByDistributorName(String distributorName);

	

	


}
