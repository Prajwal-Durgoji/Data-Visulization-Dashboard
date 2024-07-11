package com.example.nadifit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.nadifit.dto.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>{
	
}
