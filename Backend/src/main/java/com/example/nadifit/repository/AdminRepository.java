package com.example.nadifit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.nadifit.dto.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long>{

	Admin findByEmail(String email);
	

}
