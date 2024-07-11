package com.example.nadifit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.nadifit.dto.Distributor;

@Repository
public interface DistributorRepository extends JpaRepository<Distributor, Long> {

	Distributor findByEmail(String email);

	boolean existsByEmail(String email);


}
